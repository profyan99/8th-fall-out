import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { loadLevel } from '../src/domain/loadLevel';

const forGirlsPayload = JSON.parse(
  readFileSync(new URL('../content/levels/level-for-girls.json', import.meta.url), 'utf8')
);
const forGirlsLevel = loadLevel(forGirlsPayload);

async function dragPath(page: Page, path: Array<{ row: number; col: number }>, gridSize: number) {
  const canvas = page.getByTestId('grid-canvas');
  const box = await canvas.boundingBox();
  if (!box) {
    throw new Error('grid canvas not visible');
  }

  const cellWidth = box.width / gridSize;
  const cellHeight = box.height / gridSize;
  const first = path[0];
  const last = path[path.length - 1];

  const startX = box.x + (first.col + 0.5) * cellWidth;
  const startY = box.y + (first.row + 0.5) * cellHeight;
  const endX = box.x + (last.col + 0.5) * cellWidth;
  const endY = box.y + (last.row + 0.5) * cellHeight;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(endX, endY);
  await page.mouse.up();
}

test('broken video still allows continue', async ({ page }) => {
  await page.goto('/?level=for-girls');
  await expect(page.getByTestId('boot-overlay')).not.toBeVisible({ timeout: 5000 });
  await dragPath(page, forGirlsLevel.words[0].path, forGirlsLevel.gridSize);

  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByTestId('video-overlay-backdrop')).toHaveClass(/signal-state-(capture|loss)/);

  await page.evaluate(() => {
    const video = document.querySelector('[data-testid="video-element"]');
    if (video) {
      video.dispatchEvent(new Event('error'));
    }
  });

  await expect(page.getByTestId('video-fallback')).toBeVisible();
  await expect(page.getByTestId('video-overlay-backdrop')).toHaveClass(/signal-state-loss/);
  await page.getByRole('button', { name: 'Продолжить' }).click();
  await expect(page.getByTestId('progress-text')).toContainText('СЛОВА: 1 ИЗ 6');
});

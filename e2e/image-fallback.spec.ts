import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { loadLevel } from '../src/domain/loadLevel';

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

test('broken image still allows continue', async ({ page }) => {
  const alinaPayload = JSON.parse(
    readFileSync(new URL('../content/levels/level-alina.json', import.meta.url), 'utf8')
  );
  const level = loadLevel(alinaPayload);
  const imageWord = level.words.find((word) => word.mediaType === 'image');
  if (!imageWord) {
    throw new Error('image word not found in level-alina');
  }

  await page.goto('/?level=alina');
  await expect(page.getByTestId('boot-overlay')).not.toBeVisible({ timeout: 5000 });
  await dragPath(page, imageWord.path, level.gridSize);

  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByTestId('media-image')).toHaveAttribute('src', '/images/egor.jpg');
  await page.evaluate(() => {
    const image = document.querySelector('[data-testid="media-image"]');
    if (image) {
      image.dispatchEvent(new Event('error'));
    }
  });

  await expect(page.getByTestId('media-image-fallback')).toBeVisible();
  await page.getByRole('button', { name: 'Продолжить' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByTestId('progress-text')).toContainText('СЛОВА: 1 ИЗ 10');
});

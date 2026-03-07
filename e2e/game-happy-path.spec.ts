import { expect, test, type Page } from '@playwright/test';

async function dragTopRowWord(page: Page) {
  const canvas = page.getByTestId('grid-canvas');
  const box = await canvas.boundingBox();
  if (!box) {
    throw new Error('grid canvas not visible');
  }

  const y = box.y + box.height * 0.06;
  const startX = box.x + box.width * 0.06;
  const endX = box.x + box.width * 0.57;
  await page.mouse.move(startX, y);
  await page.mouse.down();
  await page.mouse.move(endX, y);
  await page.mouse.up();
}

test('completes level on happy path', async ({ page }) => {
  await page.goto('/?level=01');
  await expect(page.getByTestId('global-parallax-backdrop')).toBeVisible();
  await expect(page.getByTestId('parallax-layer-0')).toBeVisible();
  await expect(page.getByTestId('parallax-layer-1')).toBeVisible();
  await expect(page.getByTestId('parallax-layer-2')).toBeVisible();
  await expect(page.getByText(/rows:\d+|selection:\d+|found-cells:\d+/i)).toHaveCount(0);
  await expect(page.getByTestId('boot-overlay')).not.toBeVisible({ timeout: 5000 });

  await dragTopRowWord(page);

  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByTestId('video-element').or(page.getByTestId('video-fallback'))).toBeVisible();
  await page.getByRole('button', { name: /close/i }).click();

  await expect(page.getByTestId('completion-banner')).toBeVisible();
  await expect(page.getByTestId('completion-banner')).toContainText('8 March transmission complete');
  await expect(page.getByTestId('progress-text')).toContainText('WORDS INDEXED: 1 OF 1');
});

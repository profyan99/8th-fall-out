import { expect, test } from '@playwright/test';

test('broken video still allows continue', async ({ page }) => {
  await page.goto('/');

  const canvas = page.getByTestId('grid-canvas');
  await canvas.hover({ position: { x: 10, y: 10 } });
  await page.mouse.down();
  await canvas.hover({ position: { x: 390, y: 10 } });
  await page.mouse.up();

  await expect(page.getByRole('dialog')).toBeVisible();

  const video = page.getByTestId('video-element');
  if ((await video.count()) > 0) {
    await video.evaluate((videoNode) => {
      videoNode.dispatchEvent(new Event('error'));
    });
  }

  await expect(page.getByTestId('video-fallback')).toBeVisible();
  await page.getByRole('button', { name: /continue/i }).click();
  await expect(page.getByTestId('completion-banner')).toBeVisible();
});

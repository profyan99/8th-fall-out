import { expect, test } from '@playwright/test';

test('broken video still allows continue', async ({ page }) => {
  await page.goto('/');

  const canvas = page.getByTestId('grid-canvas');
  await canvas.hover({ position: { x: 10, y: 10 } });
  await page.mouse.down();
  await canvas.hover({ position: { x: 350, y: 10 } });
  await page.mouse.up();

  await expect(page.getByRole('dialog')).toBeVisible();

  await page.evaluate(() => {
    const video = document.querySelector('[data-testid="video-element"]');
    if (video) {
      video.dispatchEvent(new Event('error'));
    }
  });

  await expect(page.getByTestId('video-fallback')).toBeVisible();
  await page.getByRole('button', { name: /continue/i }).click();
  await expect(page.getByTestId('completion-banner')).toBeVisible();
});

import { expect, test } from '@playwright/test';

test('completes level on happy path', async ({ page }) => {
  await page.goto('/');

  const canvas = page.getByTestId('grid-canvas');
  await canvas.hover({ position: { x: 10, y: 10 } });
  await page.mouse.down();
  await canvas.hover({ position: { x: 390, y: 10 } });
  await page.mouse.up();

  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: /close/i }).click();

  await expect(page.getByTestId('completion-banner')).toBeVisible();
  await expect(page.getByTestId('progress-text')).toContainText('1/1 words found');
});

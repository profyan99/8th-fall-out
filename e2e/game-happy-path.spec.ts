import { expect, test } from '@playwright/test';

test('completes level on happy path', async ({ page }) => {
  await page.goto('/?level=01');
  await expect(page.getByTestId('global-parallax-backdrop')).toBeVisible();
  await expect(page.getByTestId('parallax-layer-0')).toBeVisible();
  await expect(page.getByTestId('parallax-layer-1')).toBeVisible();
  await expect(page.getByTestId('parallax-layer-2')).toBeVisible();
  await expect(page.getByText(/rows:\d+|selection:\d+|found-cells:\d+/i)).toHaveCount(0);

  const canvas = page.getByTestId('grid-canvas');
  await canvas.hover({ position: { x: 10, y: 10 } });
  await page.mouse.down();
  await canvas.hover({ position: { x: 350, y: 10 } });
  await page.mouse.up();

  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: /close/i }).click();

  await expect(page.getByTestId('completion-banner')).toBeVisible();
  await expect(page.getByTestId('completion-banner')).toContainText('8 March transmission complete');
  await expect(page.getByTestId('progress-text')).toContainText('1/1 words found');
});

import { expect, test } from '@playwright/test';

test('invalid drag does not mark word', async ({ page }) => {
  await page.goto('/');

  const canvas = page.getByTestId('grid-canvas');
  await canvas.hover({ position: { x: 10, y: 70 } });
  await page.mouse.down();
  await canvas.hover({ position: { x: 220, y: 220 } });
  await page.mouse.up();

  await expect(page.getByTestId('progress-text')).toContainText('0/1 words found');
});

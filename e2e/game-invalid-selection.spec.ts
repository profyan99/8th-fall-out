import { expect, test } from '@playwright/test';

test('invalid drag does not mark word', async ({ page }) => {
  await page.goto('/?level=01');
  await expect(page.getByTestId('boot-overlay')).not.toBeVisible({ timeout: 5000 });

  const canvas = page.getByTestId('grid-canvas');
  await canvas.hover({ position: { x: 10, y: 70 } });
  await page.mouse.down();
  await canvas.hover({ position: { x: 220, y: 220 } });
  await page.mouse.up();

  await expect(page.getByTestId('progress-text')).toContainText('WORDS: 0 OF 1');
});

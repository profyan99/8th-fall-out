import { expect, test } from "@playwright/test";

test("captures crt visual states", async ({ page }) => {
  await page.goto("/?visual=1");

  await expect(page.getByTestId("boot-overlay")).toBeVisible();
  await expect(page).toHaveScreenshot("boot-start.png");

  await expect(page.getByTestId("boot-overlay")).not.toBeVisible({ timeout: 5000 });
  await expect(page).toHaveScreenshot("boot-finish.png");

  await expect(page).toHaveScreenshot("playing.png");

  const canvas = page.getByTestId("grid-canvas");
  await canvas.hover({ position: { x: 10, y: 10 } });
  await page.mouse.down();
  await canvas.hover({ position: { x: 390, y: 10 } });
  await page.mouse.up();

  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page).toHaveScreenshot("video-overlay.png");

  await page.getByRole("button", { name: /close/i }).click();
  await expect(page.getByTestId("completion-banner")).toBeVisible();
  await expect(page).toHaveScreenshot("completion.png");
});

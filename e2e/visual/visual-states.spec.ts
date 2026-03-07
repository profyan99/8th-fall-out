import { expect, test, type Page } from "@playwright/test";

async function dragTopRowWord(page: Page) {
  const canvas = page.getByTestId("grid-canvas");
  const box = await canvas.boundingBox();
  if (!box) {
    throw new Error("grid canvas not visible");
  }

  const y = box.y + box.height * 0.06;
  const startX = box.x + box.width * 0.06;
  const endX = box.x + box.width * 0.57;
  await page.mouse.move(startX, y);
  await page.mouse.down();
  await page.mouse.move(endX, y);
  await page.mouse.up();
}

test("captures crt visual states", async ({ page }) => {
  await page.goto("/?level=01&visual=1");

  await expect(page.getByTestId("boot-overlay")).toBeVisible();
  await expect(page).toHaveScreenshot("boot-start.png");

  await expect(page.getByTestId("boot-overlay")).not.toBeVisible({ timeout: 5000 });
  await expect(page).toHaveScreenshot("boot-finish.png");

  await expect(page).toHaveScreenshot("playing.png");

  await dragTopRowWord(page);

  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByTestId("video-overlay-backdrop")).toHaveClass(/signal-state-capture/);
  await expect(page).toHaveScreenshot("video-overlay.png");

  await page.getByRole("button", { name: "Закрыть" }).click();
  await expect(page.getByTestId("completion-banner")).toBeVisible();
  await expect(page).toHaveScreenshot("completion.png");
});

import { test, expect } from "@playwright/test";

/**
 * E2E Tests for Home Page
 */

test.describe("Home Page", () => {
  test("should display the correct heading", async ({ page }) => {
    await page.goto("/");
    
    await expect(page.locator("h1")).toContainText("Cold Start");
  });

  test("should have a sign in link", async ({ page }) => {
    await page.goto("/");
    
    const signInLink = page.locator('a[href="/sign-in"]');
    await expect(signInLink).toBeVisible();
  });

  test("should have a get started link", async ({ page }) => {
    await page.goto("/");
    
    const getStartedLink = page.locator('a[href="/sign-up"]');
    await expect(getStartedLink).toBeVisible();
  });
});

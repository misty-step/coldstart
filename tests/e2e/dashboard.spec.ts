import { test, expect } from "@playwright/test";

/**
 * E2E Tests for Dashboard
 * 
 * Note: The dashboard is protected and requires authentication.
 * Unauthenticated users should be redirected.
 */

test.describe("Dashboard", () => {
  test("should redirect unauthenticated users to sign in", async ({ page }) => {
    await page.goto("/dashboard");
    
    // Should be redirected to sign in
    await expect(page).toHaveURL(/.*sign-in.*/);
  });

  test("billing page should also require authentication", async ({ page }) => {
    await page.goto("/dashboard/billing");
    
    // Should be redirected to sign in
    await expect(page).toHaveURL(/.*sign-in.*/);
  });
});

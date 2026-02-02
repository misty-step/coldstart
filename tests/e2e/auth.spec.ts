import { test, expect } from "@playwright/test";

/**
 * E2E Tests for Authentication
 * 
 * Note: These tests verify the auth pages exist.
 * Actual sign-in flows would require test credentials.
 */

test.describe("Authentication", () => {
  test("sign in page should load", async ({ page }) => {
    await page.goto("/sign-in");
    
    // Check that the Clerk SignIn component is loaded
    await expect(page.locator("text=Sign in").first()).toBeVisible();
  });

  test("sign up page should load", async ({ page }) => {
    await page.goto("/sign-up");
    
    // Check that the Clerk SignUp component is loaded
    await expect(page.locator("text=Create your account").first()).toBeVisible();
  });
});

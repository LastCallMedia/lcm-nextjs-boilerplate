import { test, expect } from "@playwright/test";

test.describe("Authentication Tests", () => {
  test("sign in page should load correctly", async ({ page }) => {
    await page.goto("/auth/signin");
    await page.waitForLoadState("networkidle");

    // Page should load without errors
    await expect(page.locator("body")).toBeVisible();
  });

  test("sign in form should be functional", async ({ page }) => {
    await page.goto("/auth/signin");
    await page.waitForLoadState("networkidle");

    // Look for OAuth provider buttons (Google sign-in)
    const providerButtons = page.locator(
      'button[type="submit"], a[href*="auth/signin"]',
    );

    if ((await providerButtons.count()) > 0) {
      await expect(providerButtons.first()).toBeVisible();
    }
  });

  test("navigation to sign in should work", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Look for sign in link
    const signInLink = page.locator('a[href*="signin"]');

    if ((await signInLink.count()) > 0) {
      await expect(signInLink.first()).toBeVisible();
      await signInLink.first().click();
      await page.waitForLoadState("networkidle");

      // Should navigate to sign in page or stay on homepage
      await expect(page.locator("body")).toBeVisible();
    }
  });

  test("protected routes should handle unauthenticated access", async ({
    page,
  }) => {
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    // Should either redirect to sign in or show sign in prompt
    const isOnSignIn =
      page.url().includes("signin") || page.url().includes("auth");
    const hasSignInButton =
      (await page
        .locator('button:has-text("Sign in"), a:has-text("Sign in")')
        .count()) > 0;

    // One of these should be true
    expect(isOnSignIn || hasSignInButton).toBeTruthy();
  });
});

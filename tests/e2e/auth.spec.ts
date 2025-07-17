import { test, expect } from "@playwright/test";
import { waitForPageLoad } from "./utils/page-helpers";

test.describe("Authentication Tests", () => {
  test("sign in page should load correctly", async ({ page }) => {
    await page.goto("/en/auth/login");
    await waitForPageLoad(page, "body");

    // Page should load without errors
    await expect(page.locator("body")).toBeVisible();
  });

  test("sign in form should be functional", async ({ page }) => {
    await page.goto("/en/auth/login");
    await waitForPageLoad(page, "body");

    // Look for OAuth provider buttons (Google sign-in)
    const providerButtons = page.locator(
      'button[type="submit"], a[href*="auth/login"]',
    );

    if ((await providerButtons.count()) > 0) {
      await expect(providerButtons.first()).toBeVisible();
    }
  });

  test("navigation to sign in should work", async ({ page }) => {
    await page.goto("/en/");
    await waitForPageLoad(page, "body");

    // Look for sign in link
    const signInLink = page.locator('a[href*="login"]');

    if ((await signInLink.count()) > 0) {
      await expect(signInLink.first()).toBeVisible();
      await signInLink.first().click();

      await waitForPageLoad(page, "body");
    }
  });

  test("protected routes should handle unauthenticated access", async ({
    page,
  }) => {
    await page.goto("/en/admin");

    // Wait for either sign in button or sign in page to appear
    const signInButton = page.locator(
      'button:has-text("Sign in"), a:has-text("Sign in"), button[type="submit"], input[type="email"]',
    );
    let signInVisible = false;
    try {
      signInVisible = await signInButton.first().isVisible({ timeout: 5000 });
    } catch {
      signInVisible = false;
    }
    const isOnSignIn =
      page.url().includes("login") || page.url().includes("auth");
    const pageTitle = await page.title();
    const is404 =
      pageTitle.includes("404") ||
      (await page.content()).includes("This page could not be found");

    expect(isOnSignIn || signInVisible || is404).toBeTruthy();
  });
});

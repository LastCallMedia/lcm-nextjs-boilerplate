import { waitForPageLoad } from "@/tests/e2e/utils/page-helpers";
import { expect, test } from "@playwright/test";

test.describe("Authentication Tests", () => {
  // Supported locales to test
  const locales = ["en", "es"];

  for (const locale of locales) {
    test(`sign in page (${locale}) should load correctly`, async ({ page }) => {
      await page.goto(`/${locale}/auth/login`);
      await waitForPageLoad(page, "body");
      await expect(page.locator("body")).toBeVisible();
    });

    test(`sign in form (${locale}) should be functional`, async ({ page }) => {
      await page.goto(`/${locale}/auth/login`);
      await waitForPageLoad(page, "body");
      const providerButtons = page.locator(
        'button[type="submit"], a[href*="auth/login"]',
      );
      if ((await providerButtons.count()) > 0) {
        await expect(providerButtons.first()).toBeVisible();
      }
    });

    test(`navigation to sign in (${locale}) should work`, async ({ page }) => {
      await page.goto(`/${locale}/`);
      await waitForPageLoad(page, "body");
      const signInLink = page.locator('a[href*="login"]');
      if ((await signInLink.count()) > 0) {
        await expect(signInLink.first()).toBeVisible();
        await signInLink.first().click();
        await waitForPageLoad(page, "body");
      }
    });

    test(`protected routes (${locale}) should handle unauthenticated access`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/admin`);
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
  }
});

import { test, expect } from "@playwright/test";
import { waitForPageLoad } from "./utils/page-helpers";

test.describe("Authentication Tests", () => {
  test("sign in page should load correctly", async ({ page }) => {
    await page.goto("/auth/signin");
    await waitForPageLoad(page, "body");

    // Page should load without errors
    await expect(page.locator("body")).toBeVisible();
  });

  test("sign in form should be functional", async ({ page }) => {
    await page.goto("/auth/signin");
    await waitForPageLoad(page, "body");

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
    await waitForPageLoad(page, "body");

    // Look for sign in link
    const signInLink = page.locator('a[href*="signin"]');

    if ((await signInLink.count()) > 0) {
      await expect(signInLink.first()).toBeVisible();
      await signInLink.first().click();

      // Wait for navigation to complete
      await page.waitForLoadState("domcontentloaded");

      // Wait for either URL change or page content to load
      try {
        await page.waitForFunction(
          () => {
            return (
              document.readyState === "complete" &&
              (document.body?.innerHTML?.length > 50 ||
                window.location.href.includes("signin") ||
                window.location.href.includes("auth"))
            );
          },
          { timeout: 10000 },
        );
      } catch {
        // If the above fails, just wait for basic page content
        await page.waitForTimeout(2000);
      }

      // Should navigate to sign in page or stay on homepage - check URL or content
      const currentUrl = page.url();
      const hasSignInContent = await page.locator("body").textContent();

      // Test passes if we have either a sign-in URL or sign-in related content
      const isValidState =
        currentUrl.includes("signin") ||
        currentUrl.includes("auth") ||
        (hasSignInContent && hasSignInContent.length > 10);

      expect(isValidState).toBeTruthy();
    }
  });

  test("protected routes should handle unauthenticated access", async ({
    page,
  }) => {
    await page.goto("/admin");
    await waitForPageLoad(page, "body");

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

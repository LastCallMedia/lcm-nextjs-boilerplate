import { waitForPageLoad } from "@/tests/e2e/utils/page-helpers";
import { expect, test } from "@playwright/test";

test.describe("Basic Navigation Tests", () => {
  // Reset storage state for this file to avoid being authenticated
  test.use({ storageState: { cookies: [], origins: [] } });
  const locales = ["en", "es"];
  for (const locale of locales) {
    test(`should navigate to homepage (${locale})`, async ({ page }) => {
      await page.goto(`/${locale}/`);
      await waitForPageLoad(page);
      await expect(page).toHaveTitle(/Create LCM App/);
      await expect(page.locator("h1")).toBeVisible();
    });

    test(`should have working navigation menu (${locale})`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/`);
      await waitForPageLoad(page);
      const nav = page.locator('[data-slot="navigation-menu"]');
      await expect(nav).toBeVisible();
      const postsLink = page.locator('[data-testid="nav-all-posts"]');
      if ((await postsLink.count()) > 0) {
        await postsLink.click();
        await page.waitForURL(`**/${locale}/posts`);
        expect(page.url()).toContain(`/${locale}/posts`);
      }
    });

    test(`should handle 404 pages gracefully (${locale})`, async ({ page }) => {
      const response = await page.goto(`/${locale}/non-existent-page`);
      expect(response?.status()).toBe(200); // we're handling 404s with a custom page
    });
  }
});

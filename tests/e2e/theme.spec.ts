import { waitForPageLoad } from "@/tests/e2e/utils/page-helpers";
import { expect, test } from "@playwright/test";

test.describe("Theme and UI Tests", () => {
  const locales = ["en", "es"];
  for (const locale of locales) {
    test(`should have theme toggle functionality (${locale})`, async ({
      page,
    }) => {
      await page.goto(`/${locale}/`);
      await waitForPageLoad(page);
      const themeToggle = page.locator('[data-testid="theme-toggle"]');
      if ((await themeToggle.count()) > 0) {
        await expect(themeToggle).toBeVisible();
        await themeToggle.click();
        const html = page.locator("html");
        const hasThemeClass = await html.evaluate(
          (el) =>
            el.classList.contains("dark") || el.classList.contains("light"),
        );
        expect(hasThemeClass).toBeTruthy();
      }
    });

    test(`should be responsive on mobile devices (${locale})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(`/${locale}/`);
      await waitForPageLoad(page);
      await expect(page.locator("body")).toBeVisible();
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      if ((await mobileMenu.count()) > 0) {
        await expect(mobileMenu).toBeVisible();
      }
    });
  }
});

import { login, waitForPageLoad } from "@/tests/e2e/utils/page-helpers";
import { expect, test } from "@playwright/test";

test.describe("Basic Navigation Tests", () => {
  const locales = ["en", "es"];
  const postsTitles = { en: "Posts", es: "Todas las Publicaciones" };
  for (const locale of locales) {
    test(`should navigate to homepage (${locale})`, async ({ page }) => {
      await page.goto(`/${locale}/`);
      await waitForPageLoad(page);
      await expect(page).toHaveTitle(/Create LCM App/);
      await expect(page.locator("h1")).toBeVisible();
    });

    test(`should navigate to posts page (${locale})`, async ({ page }) => {
      // Login first to view protected content
      await login(page, "USER");
      await page.goto(`/${locale}/posts`);
      await waitForPageLoad(page);
      await expect(page.locator("h1")).toContainText(
        postsTitles[locale as "en" | "es"],
      );
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

test.describe("Post Management Tests", () => {
  const locales = ["en", "es"];
  const postsTitles = { en: "Posts", es: "Todas las Publicaciones" };
  for (const locale of locales) {
    test(`should display posts list (${locale})`, async ({ page }) => {
      // Login first since posts page is protected
      await login(page, "USER");
      await page.goto(`/${locale}/posts`);
      await waitForPageLoad(page);
      await expect(page.locator("h1")).toContainText(
        postsTitles[locale as "en" | "es"],
      );
    });

    test(`should show create post button/link (${locale})`, async ({
      page,
    }) => {
      // Login first since posts page is protected
      await login(page, "USER");
      await page.goto(`/${locale}/posts`);
      await waitForPageLoad(page);
      await expect(page.locator("h1")).toContainText(
        postsTitles[locale as "en" | "es"],
      );
      const createButton = page.locator(
        'a[href*="create"], button:has-text("Create")',
      );
      if ((await createButton.count()) > 0) {
        await expect(createButton.first()).toBeVisible();
      }
    });

    test(`should navigate to create post page (${locale})`, async ({
      page,
    }) => {
      // Login first since create post page is protected
      await login(page, "USER");
      await page.goto(`/${locale}/posts/create`);
      await waitForPageLoad(page, "body");
      await expect(page.locator("body")).toBeVisible();
    });
  }
});

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

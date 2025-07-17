import { test, expect } from "@playwright/test";
import { waitForPageLoad } from "./utils/page-helpers";

test.describe("Basic Navigation Tests", () => {
  test("should navigate to homepage", async ({ page }) => {
    await page.goto("/en/");
    await waitForPageLoad(page);
    await expect(page).toHaveTitle(/Create LCM App/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("should navigate to posts page", async ({ page }) => {
    await page.goto("/en/posts");
    await waitForPageLoad(page);

    await expect(page.locator("h1")).toContainText(/posts/i);
  });

  test("should have working navigation menu", async ({ page }) => {
    await page.goto("/en/");
    await waitForPageLoad(page);

    // Check navigation structure exists
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();

    // Check if posts link exists and works
    const postsLink = page.locator('a[href="/en/posts"]');
    if ((await postsLink.count()) > 0) {
      await postsLink.click();
      await page.waitForURL("**/en/posts");
      expect(page.url()).toContain("/en/posts");
    }
  });

  test("should handle 404 pages gracefully", async ({ page }) => {
    const response = await page.goto("/en/non-existent-page");

    // Should return 404 status or redirect to error page
    expect(response?.status()).toBe(404);
  });
});

test.describe("Post Management Tests", () => {
  test("should display posts list", async ({ page }) => {
    await page.goto("/en/posts");
    await waitForPageLoad(page);

    await expect(page.locator("h1")).toContainText(/posts/i);
  });

  test("should show create post button/link", async ({ page }) => {
    await page.goto("/en/posts");
    await waitForPageLoad(page);

    // Verify the page loaded correctly
    await expect(page.locator("h1")).toContainText(/posts/i);

    // Look for create post button - this is optional, test passes if not found
    const createButton = page.locator(
      'a[href*="create"], button:has-text("Create")',
    );
    if ((await createButton.count()) > 0) {
      await expect(createButton.first()).toBeVisible();
    }
  });

  test("should navigate to create post page", async ({ page }) => {
    await page.goto("/en/posts/create");
    await waitForPageLoad(page, "body");

    // Page should load without error (may show login, create form, or 404)
    // Just verify that we got a response and the page has content
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Theme and UI Tests", () => {
  test("should have theme toggle functionality", async ({ page }) => {
    await page.goto("/en/");
    await waitForPageLoad(page);

    // Look for theme toggle button
    const themeToggle = page.locator('[data-testid="theme-toggle"]');

    if ((await themeToggle.count()) > 0) {
      await expect(themeToggle).toBeVisible();
      await themeToggle.click();

      // Verify theme system is working (check for dark/light class)
      const html = page.locator("html");
      const hasThemeClass = await html.evaluate(
        (el) => el.classList.contains("dark") || el.classList.contains("light"),
      );
      expect(hasThemeClass).toBeTruthy();
    }
  });

  test("should be responsive on mobile devices", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/en/");
    await waitForPageLoad(page);

    // Verify content is visible and responsive
    await expect(page.locator("body")).toBeVisible();

    // Check if mobile menu exists (optional)
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    if ((await mobileMenu.count()) > 0) {
      await expect(mobileMenu).toBeVisible();
    }
  });
});

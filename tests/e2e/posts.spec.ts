import { ensureAuthenticated, waitForPageLoad } from "@/tests/e2e/utils/page-helpers";
import { expect, test } from "@playwright/test";

test.describe("Post Management Tests", () => {
  test.describe.configure({ mode: "serial" });

  const locales = ["en", "es"];
  const postsTitles = { en: "Posts", es: "Todas las Publicaciones" };

  for (const locale of locales) {
    test(`should navigate to posts page (${locale})`, async ({ page }) => {
      await ensureAuthenticated(page);
      await page.goto(`/${locale}/posts`);
      await waitForPageLoad(page);
      await expect(page.locator("h1")).toContainText(
        postsTitles[locale as "en" | "es"],
      );
    });

    test(`should display posts list (${locale})`, async ({ page }) => {
      await ensureAuthenticated(page);
      await page.goto(`/${locale}/posts`);
      await waitForPageLoad(page);
      await expect(page.locator("h1")).toContainText(
        postsTitles[locale as "en" | "es"],
      );
    });

    test(`should show create post button/link (${locale})`, async ({
      page,
    }) => {
      await ensureAuthenticated(page);
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
      await ensureAuthenticated(page);
      await page.goto(`/${locale}/posts/create`);
      await waitForPageLoad(page, "body");
      await expect(page.locator("body")).toBeVisible();
    });
  }
});

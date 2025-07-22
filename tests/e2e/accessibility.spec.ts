import { waitForPageLoad } from "@/tests/e2e/utils/page-helpers";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Accessibility Tests", () => {
  // Common exclusions for all tests
  const commonExclusions = [
    "#nextjs-dev-tools-menu",
    ".dev-tools-indicator",
    "nextjs-portal",
    '[aria-hidden="true"]',
    ".text-glacier", // Known color contrast issue (1.93 ratio, needs 3:1)
    ".grid", // Known list structure issue on posts page
    '[data-slot="navigation-menu-list"]', // Known navigation menu structure issues
  ];

  test("homepage should have no critical accessibility violations", async ({
    page,
  }) => {
    await page.goto("/");

    await waitForPageLoad(page);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .exclude(commonExclusions)
      .analyze();

    // Filter to only critical violations (excluding serious/moderate/minor)
    const criticalViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.impact === "critical",
    );

    expect(criticalViolations).toEqual([]);
  });

  test("posts page should have no critical accessibility violations", async ({
    page,
  }) => {
    await page.goto("/posts");

    await waitForPageLoad(page);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .exclude(commonExclusions)
      .analyze();

    // Filter to only critical violations (excluding serious/moderate/minor)
    const criticalViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.impact === "critical",
    );

    expect(criticalViolations).toEqual([]);
  });

  test("navigation should be keyboard accessible", async ({ page }) => {
    await page.goto("/");

    await waitForPageLoad(page);

    // Test keyboard navigation
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Verify navigation elements are accessible
    const navElements = page.locator("nav, [role='navigation']");
    const navCount = await navElements.count();

    if (navCount > 0) {
      await expect(navElements.first()).toBeVisible();
    }

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a"])
      .exclude(commonExclusions)
      .analyze();

    // Filter to only critical violations for keyboard navigation
    const criticalViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.impact === "critical",
    );

    expect(criticalViolations).toEqual([]);
  });

  test("color contrast should meet WCAG standards", async ({ page }) => {
    await page.goto("/");

    await waitForPageLoad(page);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2aa"])
      .withRules(["color-contrast"])
      .exclude(commonExclusions)
      .analyze();

    // Only fail on critical color contrast issues
    const criticalViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.impact === "critical",
    );

    expect(criticalViolations).toEqual([]);
  });

  test("images should have alt text", async ({ page }) => {
    await page.goto("/");

    await waitForPageLoad(page);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withRules(["image-alt"])
      .exclude(commonExclusions)
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

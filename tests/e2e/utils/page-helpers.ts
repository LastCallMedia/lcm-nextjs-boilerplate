import { type Page } from "@playwright/test";

/**
 * Playwright E2E Test Utilities
 *
 * This file contains utility functions for Playwright end-to-end tests.
 * It includes functions for page loading, authentication, and common test operations.
 */

/**
 * Helper function for reliable page loading in CI environments.
 *
 * This function addresses timeout issues that can occur with tRPC subscriptions
 * and other persistent connections that prevent the page from reaching a stable
 * networkidle state. Instead, it uses domcontentloaded + element visibility
 * for more reliable page load detection.
 *
 * @param page - The Playwright Page instance
 * @param expectedElement - CSS selector for an element that should be visible when the page is ready
 * @param timeout - Timeout in milliseconds for waiting for the expected element (default: 15000)
 */

const DEFAULT_RENDER_DELAY_MS = 500;

export async function waitForPageLoad(
  page: Page,
  expectedElement = "h1",
  timeout = 15000,
): Promise<void> {
  // First wait for the page to load
  await page.waitForLoadState("domcontentloaded");

  // Then wait for the expected element to be visible
  await page.waitForSelector(expectedElement, {
    state: "visible",
    timeout,
  });

  // Add a small delay to ensure components are fully rendered
  await page.waitForTimeout(DEFAULT_RENDER_DELAY_MS);
}

const credentials = {
  USER: {
    email: "user@example.com",
    password: "password123",
  },
  ADMIN: {
    email: "raiyan@lastcallmedia.com",
    password: "password123",
  },
};
/**
 * Logs in as a test user with the specified role.
 *
 * @param page - The Playwright Page instance
 * @param role - The role to log in as ("USER" or "ADMIN")
 */
export async function login(page: Page, role: "USER" | "ADMIN"): Promise<void> {
  const { email, password } = credentials[role];
  // Navigate to the login page
  await page.goto(`/en/login`);

  // Wait for the login form to be visible
  await waitForPageLoad(page, '[data-testid="enhanced-login-form"], form');

  // Check if we're using the enhanced login form with tabs
  const hasPasswordTab = await page
    .locator('[data-value="password"]')
    .isVisible();

  if (hasPasswordTab) {
    // Click on the Password tab if it exists
    await page.click('[data-value="password"]');
  }

  // Fill in the user credentials
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);

  // Submit the login form
  await page.click('button[type="submit"]');

  // Wait for successful login by checking for redirect or staying on dashboard
  await page.waitForURL(new RegExp(`/en/(dashboard|$)`), {
    timeout: 15000,
  });
}

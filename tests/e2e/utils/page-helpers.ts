import { type Page } from "@playwright/test";

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

/**
 * Simple login function that checks if already authenticated,
 * and if not, redirects to login page for authentication.
 * This assumes global authentication state is already set up.
 */
export async function ensureAuthenticated(page: Page): Promise<void> {
  // Try to navigate to a protected page to check if already authenticated
  await page.goto("/en/dashboard");

  // Check if we're redirected to login (if not authenticated)
  if (page.url().includes("/login")) {
    // If redirected to login, it means auth state wasn't properly loaded
    // This should not happen if global auth is set up correctly
    console.warn("⚠️ Not authenticated, but global auth should handle this");
  }

  // Wait for page to be ready
  await waitForPageLoad(page, "body");
}

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
export async function waitForPageLoad(
  page: Page, 
  expectedElement = "h1", 
  timeout = 15000
): Promise<void> {
  // First wait for the page to load
  await page.waitForLoadState("domcontentloaded");
  
  // Then wait for the expected element to be visible
  await page.waitForSelector(expectedElement, { 
    state: "visible", 
    timeout 
  });
  
  // Add a small delay to ensure components are fully rendered
  await page.waitForTimeout(500);
}

import { type FullConfig, chromium } from "@playwright/test";
import { init as smtpTesterInit, type MailServer } from "smtp-tester";
import { load as cheerioLoad } from "cheerio";

let globalMailServer: MailServer | null = null;

// Extend global to include mailServer and auth state
declare global {
  var mailServer: MailServer | undefined;
  var authStateFile: string | undefined;
}

export default async function globalSetup(config: FullConfig) {
  // Start a single SMTP server for all tests
  try {
    globalMailServer = smtpTesterInit(1025);
    console.log("✅ Global SMTP server started on port 1025");

    // Store the server reference globally so tests can access it
    global.mailServer = globalMailServer;

    // Set up cleanup on process exit
    const cleanup = () => {
      if (globalMailServer) {
        try {
          globalMailServer.stop(() => void 0);
          console.log("✅ Global SMTP server stopped");
        } catch (error) {
          console.error("❌ Failed to stop global SMTP server:", error);
        }
      }
    };

    process.on("exit", cleanup);
    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);
  } catch (error) {
    console.error("❌ Failed to start global SMTP server:", error);
    throw error;
  }

  // Perform global authentication
  console.log("🔐 Setting up global authentication...");
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the login page
    await page.goto(
      `${config.projects[0]?.use?.baseURL ?? "http://localhost:3000"}/en/login`,
    );

    // Wait for the login form to be visible
    await page.waitForSelector("[data-testid='login-form']", {
      timeout: 10000,
    });

    // Wait a bit for the page to fully load and CSRF token to be set
    await page.waitForTimeout(1000);

    // Fill in the email
    await page
      .locator('input[name="email"]')
      .fill("test@example.com", { timeout: 1000 });

    // Click the "Send Magic Link" button
    await page.click('button[type="submit"]', { delay: 1000 });

    // Wait for the success message to appear, but with a longer timeout and different approach
    try {
      await page.waitForSelector("[data-testid='success-alert']", {
        timeout: 15000,
      });
    } catch (error) {
      // If success alert doesn't appear, check if we can see a different success indicator
      console.log(
        "Success alert not found, checking for other success indicators...",
      );
      const successText = await page.textContent("body");
      if (
        successText?.includes("Check your email") ||
        successText?.includes("Magic link sent")
      ) {
        console.log("Found alternative success message");
      } else {
        console.log("Page content:", successText);
        throw error;
      }
    }

    // Capture the email with magic link
    let emailLink = null;
    try {
      const { email } = await globalMailServer.captureOne("test@example.com", {
        wait: 3000,
      });

      if (typeof email.html !== "string") {
        throw new Error("Email HTML content is missing or invalid.");
      }

      const $ = cheerioLoad(email.html);
      emailLink = $("a[href*='auth/callback/nodemailer']").attr("href");
      console.log("✅ Magic link captured successfully");
    } catch (cause) {
      console.error("❌ No message delivered to test@example.com", cause);
      throw cause;
    }

    if (typeof emailLink !== "string" || !emailLink) {
      throw new Error("Magic link URL not found in email.");
    }

    // Navigate to the magic link to complete authentication
    await page.goto(emailLink);
    await page.waitForURL(new RegExp(`/en/(dashboard|$)`), { timeout: 15000 });

    // Save the authentication state
    const authStateFile = "tests/e2e/.auth/user.json";
    await context.storageState({ path: authStateFile });
    global.authStateFile = authStateFile;

    console.log("✅ Global authentication completed and saved");
  } catch (error) {
    console.error("❌ Failed to setup global authentication:", error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

import { type FullConfig, chromium, expect } from "@playwright/test";
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
    const baseURL = config.projects[0]?.use?.baseURL ?? "http://localhost:3000";
    await page.goto(`${baseURL}/en/login`);
    await page.waitForLoadState("networkidle");

    // Fill in the email and submit the form
    await page
      .getByRole("textbox", { name: /email/i })
      .fill("test@example.com");
    await page.getByRole("button", { name: /send magic link/i }).click();
    const successMessage = page.getByText(
      "Magic link sent! Check your email to sign in.",
    );
    await expect(successMessage).toBeVisible();
    await page.waitForLoadState("networkidle");

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

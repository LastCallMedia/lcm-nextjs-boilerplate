import { chromium, expect, type FullConfig } from "@playwright/test";
import { load as cheerioLoad } from "cheerio";

// Extend global to include auth state
declare global {
  var authStateFile: string | undefined;
}

type MailHogMessage = {
  ID: string;
  Content: {
    Headers: {
      To?: string[];
      From?: string[];
      Subject?: string[];
    };
    Body: string;
  };
};

type MailHogResponse = {
  total: number;
  count: number;
  start: number;
  items: MailHogMessage[];
};

const MAILHOG_API_URL = "http://localhost:8025";
const TEST_EMAIL = "test@example.com";

async function clearMailHog(): Promise<void> {
  const response = await fetch(`${MAILHOG_API_URL}/api/v1/messages`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to clear MailHog messages: ${response.status} ${response.statusText}`,
    );
  }

  console.log("✅ MailHog messages cleared");
}

async function getMailHogMessages(): Promise<MailHogMessage[]> {
  const response = await fetch(`${MAILHOG_API_URL}/api/v2/messages`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch MailHog messages: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as MailHogResponse;

  return data.items;
}

async function waitForEmail(
  recipient: string,
  timeout = 10_000,
): Promise<MailHogMessage> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeout) {
    const messages = await getMailHogMessages();

    const message = messages.find((item) =>
      item.Content.Headers.To?.some((to) => to.includes(recipient)),
    );

    if (message) {
      return message;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`No message delivered to ${recipient}`);
}

export default async function globalSetup(config: FullConfig) {
  console.log("🔐 Setting up global authentication...");

  // Make sure we do not accidentally use an old MailHog message.
  await clearMailHog();

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the login page.
    const baseURL =
      config.projects[0]?.use?.baseURL ?? "http://localhost:3000";

    await page.goto(`${baseURL}/en/login`);
    await page.waitForLoadState("networkidle");

    // Fill in the email and submit the form.
    await page
      .getByRole("textbox", { name: /email/i })
      .fill(TEST_EMAIL);

    await page
      .getByRole("button", { name: /send magic link/i })
      .click();

    const successMessage = page.getByText(
      "Magic link sent! Check your email to sign in.",
    );

    await expect(successMessage).toBeVisible();
    await page.waitForLoadState("networkidle");

    // Capture the email with the magic link from MailHog.
    let emailLink: string | undefined;

    try {
      const message = await waitForEmail(TEST_EMAIL);

      const html = message.Content.Body;

      if (!html) {
        throw new Error("Email HTML content is missing or invalid.");
      }

      const $ = cheerioLoad(html);

      emailLink = $("a[href*='auth/callback/nodemailer']").attr("href");

      console.log("✅ Magic link captured successfully");
    } catch (cause) {
      console.error(`❌ No message delivered to ${TEST_EMAIL}`, cause);
      throw cause;
    }

    if (!emailLink) {
      throw new Error("Magic link URL not found in email.");
    }

    // Navigate to the magic link to complete authentication.
    await page.goto(emailLink);

    await page.waitForURL(new RegExp(`/en/(dashboard|$)`), {
      timeout: 15_000,
    });

    // Save the authentication state.
    const authStateFile = "tests/e2e/.auth/user.json";

    await context.storageState({
      path: authStateFile,
    });

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

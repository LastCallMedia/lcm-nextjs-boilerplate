import { chromium, expect, type FullConfig } from "@playwright/test";
import { load as cheerioLoad } from "cheerio";
import { decodeMailHogBody } from "./utils/mailhog";

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
      "Content-Transfer-Encoding"?: string[];
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

const MAILHOG_API_URL = process.env.MAILHOG_API_URL ?? "http://localhost:8025";

const TEST_EMAIL = "test@example.com";

async function waitForMailHog(timeout = 10_000): Promise<void> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeout) {
    try {
      const response = await fetch(`${MAILHOG_API_URL}/api/v2/messages`);

      if (response.ok) {
        return;
      }
    } catch {
      // MailHog is not ready yet.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`MailHog is not available at ${MAILHOG_API_URL}`);
}

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
  timeout = 15_000,
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

  await waitForMailHog();
  await clearMailHog();

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const baseURL = config.projects[0]?.use?.baseURL ?? "http://localhost:3000";

    const providersResponse = await context.request.get(
      `${baseURL}/api/auth/providers`,
    );
    if (!providersResponse.ok()) {
      throw new Error(
        `Failed to load authentication providers: ${providersResponse.status()}`,
      );
    }
    const providers = (await providersResponse.json()) as {
      nodemailer?: unknown;
    };
    if (!providers.nodemailer) {
      throw new Error(
        "Nodemailer authentication provider is missing. Configure EMAIL_SERVER and EMAIL_FROM for the application server.",
      );
    }

    await page.goto(`${baseURL}/en/login`);
    await page.waitForLoadState("networkidle");

    await page.getByRole("textbox", { name: /email/i }).fill(TEST_EMAIL);

    await page.getByRole("button", { name: /send magic link/i }).click();

    let emailLink: string | undefined;

    try {
      await expect(page.getByTestId("success-alert")).toHaveText(
        "Magic link sent! Check your email to sign in.",
        { timeout: 15_000 },
      );

      const message = await waitForEmail(TEST_EMAIL);

      const html = decodeMailHogBody(
        message.Content.Body,
        message.Content.Headers["Content-Transfer-Encoding"]?.[0],
      );

      if (!html) {
        throw new Error("Email HTML content is missing or invalid.");
      }

      const $ = cheerioLoad(html);

      emailLink = $("a[href*='auth/callback/nodemailer']").attr("href");
    } catch (cause) {
      console.error(`❌ Failed to send or read magic link for ${TEST_EMAIL}`);
      console.error("Current URL:", page.url());

      const notifications = await page
        .locator('[data-sonner-toast], [role="alert"]')
        .allTextContents()
        .catch(() => []);

      console.error("Notifications:", notifications);

      const pageText = await page
        .locator("body")
        .innerText()
        .catch(() => "");

      console.error("Page text:", pageText.slice(0, 3000));

      throw cause;
    }

    if (!emailLink) {
      throw new Error("Magic link URL not found in email.");
    }

    console.log("✅ Magic link captured successfully");

    await page.goto(emailLink);

    await page.waitForURL(new RegExp(`/en/(dashboard|$)`), {
      timeout: 15_000,
    });

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

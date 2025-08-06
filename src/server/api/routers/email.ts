import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env.js";

/**
 * Check if Resend should be used or fall back to SMTP
 */
function shouldUseResend(): boolean {
  const hasResendApiKey = !!env.RESEND_API_KEY;
  const hasEmailFrom = !!env.EMAIL_FROM;
  const isLocalDevelopment =
    env.NODE_ENV === "development" && env.EMAIL_FROM?.includes(".local");

  return hasResendApiKey && hasEmailFrom && !isLocalDevelopment;
}

export const emailRouter = createTRPCRouter({
  /**
   * Get email service status
   */
  getEmailServiceStatus: publicProcedure.query(() => {
    const useResend = shouldUseResend();
    const hasSmtpServer = !!env.EMAIL_SERVER;
    const isLocalDevelopment =
      env.NODE_ENV === "development" && env.EMAIL_FROM?.includes(".local");

    return {
      service: useResend ? "resend" : "smtp",
      configured: useResend ? !!env.RESEND_API_KEY : hasSmtpServer,
      isLocalDevelopment,
      features: {
        magicLinks: useResend || hasSmtpServer,
      },
      from: env.EMAIL_FROM ?? "Not configured",
      reason: useResend
        ? "Using Resend for production emails"
        : isLocalDevelopment
          ? "Using MailHog for local development"
          : "Email service not properly configured",
    };
  }),
});

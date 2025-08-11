import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { isGoogleAuthConfigured } from "~/lib/auth-utils";
import { render } from "@react-email/render";
import { resend } from "~/lib/email";
import { MagicLinkEmail } from "~/_components/email";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: "USER" | "ADMIN";
      language?: string;
      // ...other properties
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: "USER" | "ADMIN";
    language?: string;
    // ...other properties
  }
}

// Build providers array conditionally
const buildProviders = () => {
  const providers = [];

  // Check if we're in development with local domain
  const isLocalDevelopment =
    process.env.NODE_ENV === "development" &&
    process.env.EMAIL_FROM?.includes(".local");

  // Use Resend for production or development with verified domains
  if (
    process.env.RESEND_API_KEY &&
    process.env.EMAIL_FROM &&
    !isLocalDevelopment
  ) {
    providers.push(
      Nodemailer({
        server: "smtp://dummy:dummy@dummy.com:587", // Required but not used
        from: process.env.EMAIL_FROM,
        // Remove name to use default "nodemailer" for consistency
        async sendVerificationRequest({ identifier: email, url, provider }) {
          try {
            if (!resend) {
              throw new Error(
                "Resend client not initialized. Check RESEND_API_KEY configuration.",
              );
            }

            const { host } = new URL(url);
            const html = await render(
              MagicLinkEmail({
                url,
                host,
                appName: "LCM Boilerplate",
              }),
            );

            const result = await resend.emails.send({
              from:
                provider.from ??
                process.env.EMAIL_FROM ??
                "noreply@yourdomain.com",
              to: email,
              subject: `Sign in to LCM Boilerplate`,
              html,
            });

            if (result.error) {
              console.error("Failed to send magic link email:", result.error);
              throw new Error(`Failed to send email: ${result.error.message}`);
            }

            console.log("Magic link email sent successfully:", result.data?.id);
          } catch (error) {
            console.error("Error sending magic link email:", error);
            throw error;
          }
        },
      }),
    );
  } else if (process.env.EMAIL_SERVER && process.env.EMAIL_FROM) {
    // Use SMTP (MailHog) for local development or when Resend is not configured
    providers.push(
      Nodemailer({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
        async sendVerificationRequest({ identifier: email, url, provider }) {
          try {
            const { host } = new URL(url);
            const html = await render(
              MagicLinkEmail({
                url,
                host,
                appName: "LCM Boilerplate",
              }),
            );

            // Use nodemailer directly for SMTP
            const nodemailer = await import("nodemailer");
            const transport = nodemailer.createTransport(
              process.env.EMAIL_SERVER,
            );

            const result = await transport.sendMail({
              from:
                provider.from ??
                process.env.EMAIL_FROM ??
                "noreply@yourdomain.com",
              to: email,
              subject: `Sign in to LCM Boilerplate`,
              html,
            });

            console.log(
              "Magic link email sent successfully via SMTP:",
              result.messageId,
            );
          } catch (error) {
            console.error("Error sending magic link email via SMTP:", error);
            throw error;
          }
        },
      }),
    );
  }

  // Include Google provider
  if (isGoogleAuthConfigured()) {
    providers.push(
      GoogleProvider({
        clientId: process.env.AUTH_GOOGLE_ID!,
        clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        allowDangerousEmailAccountLinking: true,
      }),
    );
  }

  return providers;
};

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: buildProviders(),
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // If user is available (first sign in or update), sync all fields
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.language = user.language;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id as string,
        role:
          token.role === "USER" || token.role === "ADMIN"
            ? token.role
            : undefined,
        language:
          typeof token.language === "string" ? token.language : undefined,
        name: token.name,
        email: token.email,
        image: typeof token.image === "string" ? token.image : undefined,
      },
    }),
    async redirect({ url, baseUrl }) {
      // Handle signout redirects
      if (url.startsWith(`${baseUrl}/api/auth/signout`)) {
        return baseUrl; // Redirect to homepage after signout
      }
      // Extract locale from url if present
      const localeMatch = /\/([a-zA-Z-]+)(?:\/|$)/.exec(url);
      const locale = localeMatch ? localeMatch[1] : "en";
      // Redirect to dashboard after successful login, preserving locale
      if (url === baseUrl || url === `${baseUrl}/login`) {
        return `${baseUrl}/${locale}/dashboard`;
      }
      // Allow relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allow callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
} satisfies NextAuthConfig;

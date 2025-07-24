import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { isGoogleAuthConfigured } from "~/lib/auth-utils";

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
      // ...other properties
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role?: "USER" | "ADMIN";
    // ...other properties
  }
}

// Build providers array conditionally
const buildProviders = () => {
  const providers = [];

  // Include Nodemailer provider for magic links
  if (process.env.EMAIL_SERVER && process.env.EMAIL_FROM) {
    providers.push(
      Nodemailer({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
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
      // If user is available (first sign in), add user id and role to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
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

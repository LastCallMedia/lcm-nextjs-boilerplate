import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { isGoogleAuthConfigured } from "~/lib/auth-utils";
import { verifyPassword } from "~/lib/password-utils";
import { db } from "~/server/db";

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

  // Include Credentials provider for email/password login
  providers.push(
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "john@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user?.password) {
          return null;
        }

        // At this point, we know user.password is not null
        const hashedPassword = user.password as string;

        // Verify password
        const passwordMatch = await verifyPassword(
          credentials.password as string,
          hashedPassword,
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          language: user.language ?? undefined,
          image: user.image,
        };
      },
    }),
  );

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

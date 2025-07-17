import NextAuth from "next-auth";
import { cache } from "react";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "~/server/db";
import { type PrismaClient } from "@prisma/client";
import { authConfig } from "./config";
import GoogleProvider from "next-auth/providers/google";
import { isGoogleAuthConfigured } from "~/lib/auth-utils";
import { env } from "~/env";

// Build providers array conditionally
const buildProviders = () => {
  const providers = [];

  if (isGoogleAuthConfigured()) {
    providers.push(
      GoogleProvider({
        clientId: env.AUTH_GOOGLE_ID!,
        clientSecret: env.AUTH_GOOGLE_SECRET!,
        allowDangerousEmailAccountLinking: true,
      }),
    );
  }

  return providers;
};

const customAdapter = PrismaAdapter(db as PrismaClient);

const {
  auth: uncachedAuth,
  handlers,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: buildProviders(),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: {
    ...customAdapter,
    createUser: async (user) => {
      if (!customAdapter.createUser) {
        throw new Error("createUser method not found on adapter");
      }

      // Ensure role is set when creating user
      const userWithRole = {
        ...user,
        role: user.role ?? "USER",
      };

      return customAdapter.createUser(userWithRole);
    },
  },
});

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };

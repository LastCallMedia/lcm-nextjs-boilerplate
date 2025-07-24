import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { cache } from "react";
import { authConfig } from "~/server/auth/config";
import { db } from "~/server/db";

const {
  auth: uncachedAuth,
  handlers,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  // Temporary workaround for ESM Prisma client compatibility
  adapter: PrismaAdapter(db as Parameters<typeof PrismaAdapter>[0]),
});

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };

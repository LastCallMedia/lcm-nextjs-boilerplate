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
  adapter: PrismaAdapter(db),
});

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };

import NextAuth from "next-auth";
import { cache } from "react";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "~/server/db";
import { authConfig } from "./config";

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

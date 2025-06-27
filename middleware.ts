import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "~/server/auth/config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  if (
    nextUrl.pathname.startsWith("/post") ||
    (req.auth && nextUrl.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

// Define the routes that should be handled by this middleware
export const config = {
  matcher: ["/post/:path*", "/posts/:path*", "/"],
};

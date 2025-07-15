import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "~/server/auth/config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;

  // Protect admin routes
  if (nextUrl.pathname.startsWith("/admin")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }

    if (req.auth.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

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
  matcher: ["/post/:path*", "/posts/:path*", "/admin/:path*", "/"],
};

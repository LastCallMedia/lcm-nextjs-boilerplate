import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "~/server/auth/config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Only protect /dashboard and /profile for unauthenticated users
  const isUserRoute = ["/dashboard", "/profile"].some((route) =>
    nextUrl.pathname.startsWith(route),
  );
  if (isUserRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Only protect /admin for unauthenticated and non-admin users
  const isAdminRoute =
    nextUrl.pathname === "/admin" || nextUrl.pathname.startsWith("/admin/");
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Do not redirect authenticated users from /dashboard or /profile
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

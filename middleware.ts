import NextAuth, { type NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";
import { defaultLocale, isValidLocale } from "~/i18n";
import { authConfig } from "~/server/auth/config";

const { auth } = NextAuth(authConfig);

// Get locale from pathname
function getLocaleFromPathname(pathname: string) {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  return maybeLocale && isValidLocale(maybeLocale) ? maybeLocale : null;
}

// Get locale from request headers
function getLocaleFromHeaders(request: NextAuthRequest) {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return defaultLocale;

  // Parse accept-language header and find best match
  const preferredLocales = acceptLanguage
    .split(",")
    .map((lang) => {
      const langCode = lang.split(";")[0]?.trim();
      return langCode?.split("-")[0]; // Take only the language part, ignore region
    })
    .filter(Boolean);

  for (const locale of preferredLocales) {
    if (locale && isValidLocale(locale)) {
      return locale;
    }
  }

  return defaultLocale;
}

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Skip middleware for API routes, static files, and internal Next.js routes
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a valid locale
  const pathnameLocale = getLocaleFromPathname(pathname);

  // If no locale in pathname, redirect to the same path with detected locale
  if (!pathnameLocale) {
    const detectedLocale = getLocaleFromHeaders(req);
    const newUrl = new URL(`/${detectedLocale}${pathname}`, req.url);
    return NextResponse.redirect(newUrl);
  }

  // If pathname has an invalid locale, redirect to default locale
  if (!isValidLocale(pathnameLocale)) {
    const pathWithoutLocale = pathname.replace(/^\/[^\/]+/, "");
    const newUrl = new URL(`/${defaultLocale}${pathWithoutLocale}`, req.url);
    return NextResponse.redirect(newUrl);
  }

  // Role-based route protection
  // Only protect /<locale>/dashboard and /<locale>/profile for unauthenticated users
  const isUserRoute = ["/dashboard", "/profile"].some((route) =>
    pathname.startsWith(`/${pathnameLocale}${route}`),
  );
  if (isUserRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL(`/${pathnameLocale}/login`, req.url));
  }

  // Only protect /<locale>/admin for unauthenticated and non-admin users
  const isAdminRoute =
    pathname === `/${pathnameLocale}/admin` ||
    pathname.startsWith(`/${pathnameLocale}/admin/`);
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/${pathnameLocale}/login`, req.url),
      );
    }
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(
        new URL(`/${pathnameLocale}/dashboard`, req.url),
      );
    }
  }

  // Add the pathname to headers so we can access it in server components
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: [
    // Skip all internal paths (_next), static files, and API routes
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

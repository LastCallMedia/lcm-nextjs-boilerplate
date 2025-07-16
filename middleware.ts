import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "~/server/auth/config";
import { defaultLocale, isValidLocale } from "~/i18n";

const { auth } = NextAuth(authConfig);

// Get locale from pathname
function getLocaleFromPathname(pathname: string) {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  return maybeLocale && isValidLocale(maybeLocale) ? maybeLocale : null;
}

// Get locale from request headers
function getLocaleFromHeaders(request: Request) {
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

  // Add the pathname to headers so we can access it in server components
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

// Define the routes that should be handled by this middleware
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

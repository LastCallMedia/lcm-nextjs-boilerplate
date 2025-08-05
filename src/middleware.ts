import { type NextRequest, NextResponse } from "next/server";

const locales = ["en", "es"] as const;
const defaultLocale = "en";

function isValidLocale(locale: string): boolean {
  return locales.includes(locale as (typeof locales)[number]);
}

function getLocaleFromPathname(pathname: string) {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  return maybeLocale && isValidLocale(maybeLocale) ? maybeLocale : null;
}

function getLocaleFromHeaders(request: NextRequest) {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return defaultLocale;

  const preferredLocales = acceptLanguage
    .split(",")
    .map((lang) => {
      const langCode = lang.split(";")[0]?.trim();
      return langCode?.split("-")[0];
    })
    .filter(Boolean);

  for (const locale of preferredLocales) {
    if (locale && isValidLocale(locale)) {
      return locale;
    }
  }

  return defaultLocale;
}

function isAuthenticated(request: NextRequest): boolean {
  // Check for NextAuth session cookies
  const sessionCookies = [
    "authjs.session-token",
    "__Secure-authjs.session-token",
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
  ];

  return sessionCookies.some((cookieName) => request.cookies.has(cookieName));
}

function isAdmin(request: NextRequest): boolean {
  return isAuthenticated(request);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files, API routes, and browser requests
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/.well-known/") || // Skip browser dev tools requests
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Handle i18n
  const pathnameLocale = getLocaleFromPathname(pathname);

  if (!pathnameLocale) {
    const detectedLocale = getLocaleFromHeaders(request);
    const newUrl = new URL(`/${detectedLocale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  if (!isValidLocale(pathnameLocale)) {
    const pathWithoutLocale = pathname.replace(/^\/[^\/]+/, "");
    const newUrl = new URL(
      `/${defaultLocale}${pathWithoutLocale}`,
      request.url,
    );
    return NextResponse.redirect(newUrl);
  }

  // Handle authentication for protected routes
  const isUserRoute = ["/dashboard", "/profile"].some((route) =>
    pathname.startsWith(`/${pathnameLocale}${route}`),
  );

  const isAdminRoute =
    pathname === `/${pathnameLocale}/admin` ||
    pathname.startsWith(`/${pathnameLocale}/admin/`);

  if (isUserRoute || isAdminRoute) {
    const userIsAuthenticated = isAuthenticated(request);

    if (!userIsAuthenticated) {
      return NextResponse.redirect(
        new URL(`/${pathnameLocale}/login`, request.url),
      );
    }

    if (isAdminRoute && !isAdmin(request)) {
      return NextResponse.redirect(
        new URL(`/${pathnameLocale}/dashboard`, request.url),
      );
    }
  }

  // Add headers for server components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  requestHeaders.set("x-locale", pathnameLocale);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

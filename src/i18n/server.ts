import { headers } from "next/headers";
import { defaultLocale, isValidLocale, type Locale } from "./config";

export async function getCurrentLocale(): Promise<Locale> {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/";

  // Extract locale from pathname
  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  if (maybeLocale && isValidLocale(maybeLocale)) {
    return maybeLocale;
  }

  return defaultLocale;
}

export function getLocaleFromParams(params: { locale?: string }): Locale {
  if (params.locale && isValidLocale(params.locale)) {
    return params.locale;
  }
  return defaultLocale;
}

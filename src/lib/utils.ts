import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { defaultLocale, isValidLocale } from "~/i18n/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSafeLocale(locale: unknown): string {
  const value = Array.isArray(locale)
    ? (locale[0] as string | undefined)
    : (locale as string | undefined);
  return typeof value === "string" && isValidLocale(value)
    ? value
    : defaultLocale;
}

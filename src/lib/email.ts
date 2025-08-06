import { Resend } from "resend";
import { env } from "~/env.js";

/**
 * Resend client instance for sending emails
 * Only initialize if API key is available to prevent build errors
 */
export const resend = env.RESEND_API_KEY
  ? new Resend(env.RESEND_API_KEY)
  : null;

/**
 * Default email sender configuration
 */
export const DEFAULT_EMAIL_FROM =
  env.EMAIL_FROM ?? "noreply@nextjs-boilerplate.lastcallmedia.com";

/**
 * Validates email address format
 *
 * @param email - Email address to validate
 * @returns True if email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Normalizes email address (lowercase, trim)
 *
 * @param email - Email address to normalize
 * @returns Normalized email address
 */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

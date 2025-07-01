import { env } from "~/env";

/**
 * Simple utility to check if Google authentication is configured
 * by checking if both required environment variables are present
 */
export function isGoogleAuthConfigured(): boolean {
  return !!(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET);
}

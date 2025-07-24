/**
 * Simple utility to check if Google authentication is configured
 * by checking if both required environment variables are present
 */
export function isGoogleAuthConfigured(): boolean {
  return !!(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
}

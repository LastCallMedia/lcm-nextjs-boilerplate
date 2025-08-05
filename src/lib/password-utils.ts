import bcrypt from "bcryptjs";

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string | null,
): Promise<boolean> {
  if (!hash) {
    return false;
  }
  return bcrypt.compare(password, hash);
}

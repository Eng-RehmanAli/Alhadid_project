import bcrypt from "bcryptjs";

/** bcrypt cost factor — higher is slower for attackers */
const BCRYPT_ROUNDS = 12;

/** Hash a plain password before storing it. Never store the raw password. */
export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, BCRYPT_ROUNDS);
}

/** Compare a login attempt against the stored hash. */
export async function verifyPassword(
  plainPassword: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, passwordHash);
}

/** Dummy hash work when the user is missing — slows timing leaks. */
export async function dummyPasswordHash(plainPassword: string): Promise<void> {
  await bcrypt.hash(plainPassword, BCRYPT_ROUNDS);
}

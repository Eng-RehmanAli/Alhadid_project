export const NAME_MAX = 80;
export const EMAIL_MAX = 254;
export const PASSWORD_MAX = 128;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase().slice(0, EMAIL_MAX);
}

export function sanitizeName(name: string) {
  return name.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, NAME_MAX);
}

export function validatePassword(password: string) {
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (password.length > PASSWORD_MAX) {
    return "Password is too long.";
  }
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must include upper and lower case letters and a number.";
  }
  return null;
}

export function isValidEmail(email: string) {
  return Boolean(email) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Blocks open redirects — only same-origin relative paths. */
export function safeNextPath(raw: FormDataEntryValue | null | string) {
  const value = String(raw ?? "").trim();
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("://")) {
    return "/";
  }
  return value;
}

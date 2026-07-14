"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connectMongo } from "@/lib/db";
import {
  dummyPasswordHash,
  hashPassword,
  verifyPassword,
} from "@/lib/password";
import { rateLimit } from "@/lib/rate-limit";
import { User } from "@/models/User";
import {
  isValidEmail,
  normalizeEmail,
  PASSWORD_MAX,
  sanitizeName,
  safeNextPath,
  validatePassword,
} from "@/lib/auth-validation";
import {
  createSession,
  destroySession,
  getSession,
  type SessionUser,
} from "@/lib/session";

export type AuthState = {
  error?: string;
  success?: string;
};

async function clientKey(prefix: string) {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || h.get("x-real-ip") || "unknown";
  return `${prefix}:${ip}`;
}

function withAuthToast(path: string, kind: "login" | "signup") {
  const url = new URL(path, "http://localhost");
  url.searchParams.set("auth", kind);
  return `${url.pathname}${url.search}${url.hash}`;
}

export async function signupAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const limit = rateLimit(await clientKey("signup"), 5, 15 * 60_000);
  if (!limit.ok) {
    return {
      error: `Too many signup attempts. Try again in ${limit.retryAfterSec}s.`,
    };
  }

  const name = sanitizeName(String(formData.get("name") ?? ""));
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");
  const next = safeNextPath(formData.get("next"));

  if (!name || name.length < 2) {
    return { error: "Please enter your full name." };
  }
  if (!isValidEmail(email)) {
    return { error: "Please enter a valid email address." };
  }
  const passwordError = validatePassword(password);
  if (passwordError) return { error: passwordError };
  if (password !== confirm) {
    return { error: "Passwords do not match." };
  }

  await connectMongo();

  const existing = await User.findOne({ email }).lean();
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    passwordHash,
    createdAt: new Date(),
  });

  await createSession({
    id: String(user._id),
    name,
    email,
  });

  redirect(withAuthToast(next, "signup"));
}

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const limit = rateLimit(await clientKey("login"), 10, 15 * 60_000);
  if (!limit.ok) {
    return {
      error: `Too many login attempts. Try again in ${limit.retryAfterSec}s.`,
    };
  }

  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");
  const next = safeNextPath(formData.get("next"));

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }
  if (password.length > PASSWORD_MAX) {
    return { error: "Invalid email or password." };
  }

  await connectMongo();

  const user = await User.findOne({ email }).lean();
  if (!user) {
    await dummyPasswordHash(password);
    return { error: "Invalid email or password." };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  await createSession({
    id: String(user._id),
    name: user.name,
    email: user.email,
  });

  redirect(withAuthToast(next, "login"));
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) redirect("/login");
  return user;
}

import { createHash, createHmac, randomUUID, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { connectMongo } from "@/lib/db";
import { RefreshToken } from "@/models/RefreshToken";
import { User } from "@/models/User";
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE_SECONDS,
  COOKIE_NAME,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE_SECONDS,
} from "@/lib/session-constants";

export {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE_SECONDS,
  COOKIE_NAME,
  MAX_AGE_SECONDS,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE_SECONDS,
} from "@/lib/session-constants";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

type AccessPayload = SessionUser & {
  typ: "access";
  exp: number;
};

type RefreshPayload = {
  typ: "refresh";
  id: string;
  jti: string;
  exp: number;
};

function getSecret(kind: "access" | "refresh" = "access") {
  const secret =
    kind === "refresh"
      ? process.env.REFRESH_TOKEN_SECRET
      : process.env.JWT_SECRET || process.env.SESSION_SECRET;
  const label =
    kind === "refresh"
      ? "REFRESH_TOKEN_SECRET"
      : "JWT_SECRET (or SESSION_SECRET)";
  if (!secret || secret.length < 32) {
    throw new Error(
      `Missing or weak ${label} (need at least 32 characters)`,
    );
  }
  return secret;
}

function sign(payload: string, kind: "access" | "refresh" = "access") {
  return createHmac("sha256", getSecret(kind))
    .update(payload)
    .digest("base64url");
}

function encodeSigned(body: object, kind: "access" | "refresh" = "access") {
  const payload = Buffer.from(JSON.stringify(body), "utf8").toString(
    "base64url",
  );
  return `${payload}.${sign(payload, kind)}`;
}

function decodeSigned(
  token: string,
  kind: "access" | "refresh" = "access",
): unknown | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload, kind);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return null;
  }

  try {
    return JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );
  } catch {
    return null;
  }
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

function clearCookieOptions() {
  return cookieOptions(0);
}

function isAccessPayload(data: unknown): data is AccessPayload {
  if (!data || typeof data !== "object") return false;
  const d = data as AccessPayload;
  return (
    d.typ === "access" &&
    typeof d.id === "string" &&
    typeof d.name === "string" &&
    typeof d.email === "string" &&
    typeof d.exp === "number"
  );
}

function isRefreshPayload(data: unknown): data is RefreshPayload {
  if (!data || typeof data !== "object") return false;
  const d = data as RefreshPayload;
  return (
    d.typ === "refresh" &&
    typeof d.id === "string" &&
    typeof d.jti === "string" &&
    typeof d.exp === "number"
  );
}

function nowSec() {
  return Math.floor(Date.now() / 1000);
}

export function createAccessToken(user: SessionUser) {
  const body: AccessPayload = {
    typ: "access",
    id: user.id,
    name: user.name,
    email: user.email,
    exp: nowSec() + ACCESS_MAX_AGE_SECONDS,
  };
  return encodeSigned(body, "access");
}

export function createRefreshTokenValue(userId: string) {
  const jti = randomUUID();
  const body: RefreshPayload = {
    typ: "refresh",
    id: userId,
    jti,
    exp: nowSec() + REFRESH_MAX_AGE_SECONDS,
  };
  return encodeSigned(body, "refresh");
}

export function verifyAccessToken(token: string): SessionUser | null {
  const data = decodeSigned(token, "access");
  if (!isAccessPayload(data)) return null;
  if (data.exp < nowSec()) return null;
  return { id: data.id, name: data.name, email: data.email };
}

export function verifyRefreshTokenShape(token: string): RefreshPayload | null {
  const data = decodeSigned(token, "refresh");
  if (!isRefreshPayload(data)) return null;
  if (data.exp < nowSec()) return null;
  return data;
}

/** @deprecated Prefer verifyAccessToken; kept for any legacy callers. */
export function decodeSession(token: string): SessionUser | null {
  return verifyAccessToken(token);
}

async function clearAuthCookies() {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, "", clearCookieOptions());
  jar.set(REFRESH_COOKIE, "", clearCookieOptions());
  jar.set(COOKIE_NAME, "", clearCookieOptions());
}

async function setAuthCookies(accessToken: string, refreshToken: string) {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, accessToken, cookieOptions(ACCESS_MAX_AGE_SECONDS));
  jar.set(REFRESH_COOKIE, refreshToken, cookieOptions(REFRESH_MAX_AGE_SECONDS));
  jar.set(COOKIE_NAME, "", clearCookieOptions());
}

/**
 * Issues a short-lived access token and a revocable refresh token (Mongo-backed).
 */
export async function createSession(user: SessionUser) {
  await connectMongo();

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshTokenValue(user.id);
  const expiresAt = new Date(Date.now() + REFRESH_MAX_AGE_SECONDS * 1000);

  await RefreshToken.create({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt,
  });

  await setAuthCookies(accessToken, refreshToken);
}

/**
 * Validates refresh cookie against DB, rotates tokens, returns the user.
 * Safe to call from Route Handlers / Server Actions (sets cookies).
 */
export async function refreshAccessToken(): Promise<SessionUser | null> {
  const jar = await cookies();
  const rawRefresh = jar.get(REFRESH_COOKIE)?.value;
  if (!rawRefresh) return null;

  const payload = verifyRefreshTokenShape(rawRefresh);
  if (!payload) {
    await clearAuthCookies();
    return null;
  }

  await connectMongo();

  const tokenHash = hashToken(rawRefresh);
  const stored = await RefreshToken.findOne({ tokenHash }).lean();
  if (!stored || stored.expiresAt.getTime() <= Date.now()) {
    if (stored) await RefreshToken.deleteOne({ _id: stored._id });
    await clearAuthCookies();
    return null;
  }

  const user = await User.findById(payload.id).lean();
  if (!user) {
    await RefreshToken.deleteMany({ userId: payload.id });
    await clearAuthCookies();
    return null;
  }

  const sessionUser: SessionUser = {
    id: String(user._id),
    name: user.name,
    email: user.email,
  };

  // Rotate refresh token
  await RefreshToken.deleteOne({ _id: stored._id });
  const newRefresh = createRefreshTokenValue(sessionUser.id);
  await RefreshToken.create({
    userId: sessionUser.id,
    tokenHash: hashToken(newRefresh),
    expiresAt: new Date(Date.now() + REFRESH_MAX_AGE_SECONDS * 1000),
  });

  const newAccess = createAccessToken(sessionUser);
  await setAuthCookies(newAccess, newRefresh);

  return sessionUser;
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const access = jar.get(ACCESS_COOKIE)?.value;
  if (access) {
    const user = verifyAccessToken(access);
    if (user) return user;
  }

  // Access missing/expired — try refresh without writing cookies here when
  // called from RSC; full rotation happens via /api/auth/refresh.
  const rawRefresh = jar.get(REFRESH_COOKIE)?.value;
  if (!rawRefresh) return null;

  const payload = verifyRefreshTokenShape(rawRefresh);
  if (!payload) return null;

  await connectMongo();
  const stored = await RefreshToken.findOne({
    tokenHash: hashToken(rawRefresh),
  }).lean();
  if (!stored || stored.expiresAt.getTime() <= Date.now()) return null;

  const user = await User.findById(payload.id).lean();
  if (!user) return null;

  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
  };
}

export async function destroySession() {
  const jar = await cookies();
  const rawRefresh = jar.get(REFRESH_COOKIE)?.value;

  if (rawRefresh) {
    await connectMongo();
    await RefreshToken.deleteOne({ tokenHash: hashToken(rawRefresh) });

    const payload = verifyRefreshTokenShape(rawRefresh);
    if (payload) {
      // Optional: revoke all sessions for this user on logout
      await RefreshToken.deleteMany({ userId: payload.id });
    }
  }

  await clearAuthCookies();
}

import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/password";
import {
  createAccessToken,
  createRefreshTokenValue,
  verifyAccessToken,
  verifyRefreshTokenShape,
  type SessionUser,
} from "@/lib/session";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/session-constants";

const user: SessionUser = {
  id: "507f1f77bcf86cd799439011",
  name: "Test User",
  email: "test@alhadid.org",
};

describe("password hashing (security)", () => {
  it("stores bcrypt hashes, never plaintext", async () => {
    const plain = "SecurePass1";
    const hash = await hashPassword(plain);

    expect(hash).not.toBe(plain);
    expect(hash.startsWith("$2")).toBe(true);
    expect(hash).toMatch(/^\$2[aby]\$\d{2}\$/);
    await expect(verifyPassword(plain, hash)).resolves.toBe(true);
    await expect(verifyPassword("WrongPass9", hash)).resolves.toBe(false);
  });
});

describe("token secrets (security)", () => {
  it("requires distinct jwt and refresh secrets in test env", () => {
    expect(process.env.JWT_SECRET).toBeTruthy();
    expect(process.env.REFRESH_TOKEN_SECRET).toBeTruthy();
    expect(process.env.JWT_SECRET).not.toBe(process.env.REFRESH_TOKEN_SECRET);
  });

  it("rejects access tokens signed with the refresh secret", () => {
    const body = {
      typ: "access",
      id: user.id,
      name: user.name,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 900,
    };
    const payload = Buffer.from(JSON.stringify(body), "utf8").toString(
      "base64url",
    );
    const signature = createHmac("sha256", process.env.REFRESH_TOKEN_SECRET!)
      .update(payload)
      .digest("base64url");

    expect(verifyAccessToken(`${payload}.${signature}`)).toBeNull();
  });

  it("rejects refresh tokens signed with the jwt secret", () => {
    const body = {
      typ: "refresh",
      id: user.id,
      jti: "cross-secret",
      exp: Math.floor(Date.now() / 1000) + 86_400,
    };
    const payload = Buffer.from(JSON.stringify(body), "utf8").toString(
      "base64url",
    );
    const signature = createHmac("sha256", process.env.JWT_SECRET!)
      .update(payload)
      .digest("base64url");

    expect(verifyRefreshTokenShape(`${payload}.${signature}`)).toBeNull();
  });

  it("does not accept cross-type tokens", () => {
    const access = createAccessToken(user);
    const refresh = createRefreshTokenValue(user.id);
    expect(verifyAccessToken(refresh)).toBeNull();
    expect(verifyRefreshTokenShape(access)).toBeNull();
  });
});

describe("auth cookies (security)", () => {
  it("uses separate cookie names for access and refresh", () => {
    expect(ACCESS_COOKIE).not.toBe(REFRESH_COOKIE);
    expect(ACCESS_COOKIE.length).toBeGreaterThan(0);
    expect(REFRESH_COOKIE.length).toBeGreaterThan(0);
  });
});

import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  createAccessToken,
  createRefreshTokenValue,
  verifyAccessToken,
  verifyRefreshTokenShape,
  type SessionUser,
} from "@/lib/session";

const user: SessionUser = {
  id: "507f1f77bcf86cd799439011",
  name: "Test User",
  email: "test@alhadid.org",
};

function signPayload(body: object, kind: "access" | "refresh") {
  const secret =
    kind === "refresh"
      ? process.env.REFRESH_TOKEN_SECRET!
      : process.env.JWT_SECRET!;
  const payload = Buffer.from(JSON.stringify(body), "utf8").toString(
    "base64url",
  );
  const signature = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

describe("access tokens", () => {
  it("creates a verifiable access token with user claims", () => {
    const token = createAccessToken(user);
    expect(verifyAccessToken(token)).toEqual(user);
  });

  it("rejects a tampered access token", () => {
    const token = createAccessToken(user);
    const [payload, signature] = token.split(".");
    const tamperedPayload = Buffer.from(
      JSON.stringify({
        typ: "access",
        id: user.id,
        name: "Hacker",
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 900,
      }),
      "utf8",
    ).toString("base64url");

    expect(verifyAccessToken(`${tamperedPayload}.${signature}`)).toBeNull();
    expect(verifyAccessToken(`${payload}.badsig`)).toBeNull();
  });

  it("rejects an expired access token", () => {
    const expired = signPayload(
      {
        typ: "access",
        id: user.id,
        name: user.name,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) - 60,
      },
      "access",
    );

    expect(verifyAccessToken(expired)).toBeNull();
  });

  it("rejects a refresh token when verifying as access", () => {
    const refresh = createRefreshTokenValue(user.id);
    expect(verifyAccessToken(refresh)).toBeNull();
  });
});

describe("refresh tokens", () => {
  it("creates a verifiable refresh token with jti", () => {
    const token = createRefreshTokenValue(user.id);
    const decoded = verifyRefreshTokenShape(token);

    expect(decoded).toMatchObject({
      typ: "refresh",
      id: user.id,
    });
    expect(decoded?.jti).toBeTruthy();
    expect(typeof decoded?.exp).toBe("number");
  });

  it("issues unique refresh tokens", () => {
    const a = createRefreshTokenValue(user.id);
    const b = createRefreshTokenValue(user.id);
    expect(a).not.toBe(b);
  });

  it("rejects a tampered refresh token", () => {
    const token = createRefreshTokenValue(user.id);
    const [, signature] = token.split(".");
    const tampered = Buffer.from(
      JSON.stringify({
        typ: "refresh",
        id: "other-user",
        jti: "fake",
        exp: Math.floor(Date.now() / 1000) + 86_400,
      }),
      "utf8",
    ).toString("base64url");

    expect(verifyRefreshTokenShape(`${tampered}.${signature}`)).toBeNull();
  });

  it("rejects an expired refresh token", () => {
    const expired = signPayload(
      {
        typ: "refresh",
        id: user.id,
        jti: "expired-jti",
        exp: Math.floor(Date.now() / 1000) - 60,
      },
      "refresh",
    );

    expect(verifyRefreshTokenShape(expired)).toBeNull();
  });

  it("rejects an access token when verifying as refresh", () => {
    const access = createAccessToken(user);
    expect(verifyRefreshTokenShape(access)).toBeNull();
  });
});

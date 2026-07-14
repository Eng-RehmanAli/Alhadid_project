import { createHash } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
} from "@/lib/session-constants";
import {
  createAccessToken,
  createRefreshTokenValue,
  createSession,
  destroySession,
  getSession,
  refreshAccessToken,
  type SessionUser,
} from "@/lib/session";

const cookieStore = new Map<string, string>();

const mockCookies = {
  get: vi.fn((name: string) => {
    const value = cookieStore.get(name);
    return value ? { name, value } : undefined;
  }),
  set: vi.fn((name: string, value: string) => {
    if (!value || value === "") {
      cookieStore.delete(name);
    } else {
      cookieStore.set(name, value);
    }
  }),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => mockCookies),
}));

vi.mock("@/lib/db", () => ({
  connectMongo: vi.fn(async () => undefined),
}));

const refreshTokenStore: Array<{
  _id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}> = [];

const users = new Map<string, { _id: string; name: string; email: string }>();

vi.mock("@/models/RefreshToken", () => ({
  RefreshToken: {
    create: vi.fn(async (doc: {
      userId: string;
      tokenHash: string;
      expiresAt: Date;
    }) => {
      const row = {
        _id: `rt_${refreshTokenStore.length + 1}`,
        userId: String(doc.userId),
        tokenHash: doc.tokenHash,
        expiresAt: doc.expiresAt,
      };
      refreshTokenStore.push(row);
      return row;
    }),
    findOne: vi.fn((query: { tokenHash: string }) => ({
      lean: async () =>
        refreshTokenStore.find((row) => row.tokenHash === query.tokenHash) ??
        null,
    })),
    deleteOne: vi.fn(async (query: { _id?: string; tokenHash?: string }) => {
      const index = refreshTokenStore.findIndex((row) => {
        if (query._id) return row._id === query._id;
        if (query.tokenHash) return row.tokenHash === query.tokenHash;
        return false;
      });
      if (index >= 0) refreshTokenStore.splice(index, 1);
      return { deletedCount: index >= 0 ? 1 : 0 };
    }),
    deleteMany: vi.fn(async (query: { userId: string }) => {
      const userId = String(query.userId);
      for (let i = refreshTokenStore.length - 1; i >= 0; i -= 1) {
        if (refreshTokenStore[i]?.userId === userId) {
          refreshTokenStore.splice(i, 1);
        }
      }
      return { deletedCount: 1 };
    }),
  },
}));

vi.mock("@/models/User", () => ({
  User: {
    findById: vi.fn((id: string) => ({
      lean: async () => users.get(String(id)) ?? null,
    })),
  },
}));

const user: SessionUser = {
  id: "507f1f77bcf86cd799439011",
  name: "Test User",
  email: "test@alhadid.org",
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

describe("session lifecycle", () => {
  beforeEach(() => {
    cookieStore.clear();
    refreshTokenStore.length = 0;
    users.clear();
    users.set(user.id, {
      _id: user.id,
      name: user.name,
      email: user.email,
    });
    vi.clearAllMocks();
  });

  it("createSession sets access and refresh cookies and stores refresh hash", async () => {
    await createSession(user);

    const access = cookieStore.get(ACCESS_COOKIE);
    const refresh = cookieStore.get(REFRESH_COOKIE);

    expect(access).toBeTruthy();
    expect(refresh).toBeTruthy();
    expect(refreshTokenStore).toHaveLength(1);
    expect(refreshTokenStore[0]?.tokenHash).toBe(hashToken(refresh!));
  });

  it("getSession returns user from a valid access cookie", async () => {
    cookieStore.set(ACCESS_COOKIE, createAccessToken(user));

    await expect(getSession()).resolves.toEqual(user);
  });

  it("getSession falls back to a stored refresh token when access is missing", async () => {
    const refresh = createRefreshTokenValue(user.id);
    cookieStore.set(REFRESH_COOKIE, refresh);
    refreshTokenStore.push({
      _id: "rt_1",
      userId: user.id,
      tokenHash: hashToken(refresh),
      expiresAt: new Date(Date.now() + 60_000),
    });

    await expect(getSession()).resolves.toEqual(user);
  });

  it("getSession returns null when refresh is not in the database", async () => {
    cookieStore.set(REFRESH_COOKIE, createRefreshTokenValue(user.id));

    await expect(getSession()).resolves.toBeNull();
  });

  it("refreshAccessToken rotates tokens and returns the user", async () => {
    const oldRefresh = createRefreshTokenValue(user.id);
    cookieStore.set(REFRESH_COOKIE, oldRefresh);
    refreshTokenStore.push({
      _id: "rt_old",
      userId: user.id,
      tokenHash: hashToken(oldRefresh),
      expiresAt: new Date(Date.now() + 60_000),
    });

    const result = await refreshAccessToken();

    expect(result).toEqual(user);
    expect(cookieStore.get(ACCESS_COOKIE)).toBeTruthy();
    expect(cookieStore.get(REFRESH_COOKIE)).toBeTruthy();
    expect(cookieStore.get(REFRESH_COOKIE)).not.toBe(oldRefresh);
    expect(refreshTokenStore).toHaveLength(1);
    expect(refreshTokenStore[0]?.tokenHash).toBe(
      hashToken(cookieStore.get(REFRESH_COOKIE)!),
    );
  });

  it("refreshAccessToken rejects unknown refresh cookies", async () => {
    cookieStore.set(REFRESH_COOKIE, createRefreshTokenValue(user.id));

    await expect(refreshAccessToken()).resolves.toBeNull();
    expect(cookieStore.has(ACCESS_COOKIE)).toBe(false);
    expect(cookieStore.has(REFRESH_COOKIE)).toBe(false);
  });

  it("destroySession clears cookies and revokes refresh tokens", async () => {
    const refresh = createRefreshTokenValue(user.id);
    cookieStore.set(ACCESS_COOKIE, createAccessToken(user));
    cookieStore.set(REFRESH_COOKIE, refresh);
    refreshTokenStore.push({
      _id: "rt_1",
      userId: user.id,
      tokenHash: hashToken(refresh),
      expiresAt: new Date(Date.now() + 60_000),
    });

    await destroySession();

    expect(cookieStore.has(ACCESS_COOKIE)).toBe(false);
    expect(cookieStore.has(REFRESH_COOKIE)).toBe(false);
    expect(refreshTokenStore).toHaveLength(0);
  });
});

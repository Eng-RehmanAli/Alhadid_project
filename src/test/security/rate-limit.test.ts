import { describe, expect, it } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rate limit (security)", () => {
  const key = `sec-login:${Math.random().toString(36).slice(2)}`;

  it("allows requests under the limit", () => {
    const k = `${key}:under`;
    expect(rateLimit(k, 3, 60_000).ok).toBe(true);
    expect(rateLimit(k, 3, 60_000).ok).toBe(true);
    expect(rateLimit(k, 3, 60_000).ok).toBe(true);
  });

  it("blocks after the limit is exceeded", () => {
    const k = `${key}:block`;
    rateLimit(k, 2, 60_000);
    rateLimit(k, 2, 60_000);
    const blocked = rateLimit(k, 2, 60_000);
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) {
      expect(blocked.retryAfterSec).toBeGreaterThan(0);
    }
  });

  it("isolates different keys", () => {
    const a = `${key}:a`;
    const b = `${key}:b`;
    rateLimit(a, 1, 60_000);
    expect(rateLimit(a, 1, 60_000).ok).toBe(false);
    expect(rateLimit(b, 1, 60_000).ok).toBe(true);
  });
});

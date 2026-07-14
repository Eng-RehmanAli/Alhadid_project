import { describe, expect, it } from "vitest";
import {
  isValidEmail,
  normalizeEmail,
  PASSWORD_MAX,
  safeNextPath,
  sanitizeName,
  validatePassword,
} from "@/lib/auth-validation";

describe("auth validation (security)", () => {
  it("rejects short or weak passwords", () => {
    expect(validatePassword("Short1")).toMatch(/at least 8/i);
    expect(validatePassword("alllowercase1")).toMatch(/upper and lower/i);
    expect(validatePassword("ALLUPPERCASE1")).toMatch(/upper and lower/i);
    expect(validatePassword("NoNumberHere")).toMatch(/number/i);
    expect(validatePassword("a".repeat(PASSWORD_MAX + 1))).toMatch(/too long/i);
  });

  it("accepts a strong enough password", () => {
    expect(validatePassword("Password1")).toBeNull();
  });

  it("normalizes email and strips control chars from names", () => {
    expect(normalizeEmail("  User@Example.COM ")).toBe("user@example.com");
    expect(sanitizeName("Ali\u0000Hadid")).toBe("AliHadid");
    expect(sanitizeName("  " + "x".repeat(100)).length).toBeLessThanOrEqual(80);
  });

  it("validates email shape", () => {
    expect(isValidEmail("a@b.co")).toBe(true);
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });

  it("blocks open-redirect next paths", () => {
    expect(safeNextPath("https://evil.com")).toBe("/");
    expect(safeNextPath("//evil.com")).toBe("/");
    expect(safeNextPath("javascript:alert(1)")).toBe("/");
    expect(safeNextPath("/courses")).toBe("/courses");
    expect(safeNextPath("/courses/acupuncture")).toBe("/courses/acupuncture");
  });
});

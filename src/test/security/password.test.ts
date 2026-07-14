import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/password";

describe("password helpers", () => {
  it("hashes and verifies a password", async () => {
    const hash = await hashPassword("StrongPass1");
    expect(hash).not.toBe("StrongPass1");
    expect(hash).toMatch(/^\$2[aby]\$\d{2}\$/);
    await expect(verifyPassword("StrongPass1", hash)).resolves.toBe(true);
    await expect(verifyPassword("WrongPass1", hash)).resolves.toBe(false);
  });
});

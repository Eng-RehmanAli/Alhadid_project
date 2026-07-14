import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/session-constants";

function request(path: string, cookies: Record<string, string> = {}) {
  const headers = new Headers();
  const cookieHeader = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
  if (cookieHeader) headers.set("cookie", cookieHeader);
  return new NextRequest(new URL(path, "http://localhost:3000"), { headers });
}

describe("middleware protection (security)", () => {
  it("redirects unauthenticated users from /courses to /join", () => {
    const res = middleware(request("/courses"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/join?next=%2Fcourses");
  });

  it("redirects unauthenticated users from /account to /join", () => {
    const res = middleware(request("/account"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/join?next=%2Faccount");
  });

  it("allows /courses when an access cookie is present", () => {
    const res = middleware(
      request("/courses", { [ACCESS_COOKIE]: "any-token-presence-check" }),
    );
    expect(res.status).toBe(200);
  });

  it("allows /courses when only a refresh cookie is present", () => {
    const res = middleware(
      request("/courses/acupuncture", {
        [REFRESH_COOKIE]: "any-refresh-presence-check",
      }),
    );
    expect(res.status).toBe(200);
  });

  it("does not guard public routes like /login", () => {
    const res = middleware(request("/login"));
    expect(res.status).toBe(200);
  });
});

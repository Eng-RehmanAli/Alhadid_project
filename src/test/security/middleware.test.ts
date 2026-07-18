import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/session-constants";

function request(path: string, cookies: Record<string, string> = {}) {
  const headers = new Headers();
  const cookieHeader = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
  if (cookieHeader) headers.set("cookie", cookieHeader);
  return new NextRequest(new URL(path, "http://localhost:3000"), { headers });
}

describe("proxy route protection (security)", () => {
  it("redirects unauthenticated users from /courses to /join", () => {
    const res = proxy(request("/courses"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/join?next=%2Fcourses");
  });

  it("redirects unauthenticated users from /account to /join", () => {
    const res = proxy(request("/account"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/join?next=%2Faccount");
  });

  it("allows /courses when an access cookie is present", () => {
    const res = proxy(
      request("/courses", { [ACCESS_COOKIE]: "any-token-presence-check" }),
    );
    expect(res.status).toBe(200);
  });

  it("allows /courses when only a refresh cookie is present", () => {
    const res = proxy(
      request("/courses/acupuncture", {
        [REFRESH_COOKIE]: "any-refresh-presence-check",
      }),
    );
    expect(res.status).toBe(200);
  });

  it("redirects unauthenticated users from /dashboard to /join", () => {
    const res = proxy(request("/dashboard"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/join?next=%2Fdashboard");
  });

  it("redirects unauthenticated users from /learn to /join", () => {
    const res = proxy(request("/learn/nlp-beginner"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain(
      "/join?next=%2Flearn%2Fnlp-beginner",
    );
  });

  it("does not guard public routes like /login", () => {
    const res = proxy(request("/login"));
    expect(res.status).toBe(200);
  });
});

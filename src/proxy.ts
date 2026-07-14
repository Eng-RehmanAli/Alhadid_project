import { NextResponse, type NextRequest } from "next/server";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
} from "@/lib/session-constants";

const PROTECTED_PREFIXES = ["/account", "/courses"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!needsAuth) {
    return NextResponse.next();
  }

  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!access && !refresh) {
    const join = new URL("/join", request.url);
    join.searchParams.set("next", pathname);
    return NextResponse.redirect(join);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/courses", "/courses/:path*"],
};

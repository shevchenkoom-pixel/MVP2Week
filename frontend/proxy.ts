// Next.js 16 renamed `middleware` to `proxy`.
//
// Guard /app and /api/* from unauthenticated requests: redirect to /login
// when the `mvp2week_token` cookie is missing. The cookie is set on
// successful fake-login and cleared on logout; its value is the fake JWT
// returned by the backend.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("mvp2week_token")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/app") && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth/session-constants";
import { defaultLocale, isLocale, localeCookieName, localeHeaderName } from "@/lib/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin")) {
    if (pathname !== "/admin/login" && !request.cookies.has(ADMIN_SESSION_COOKIE)) return NextResponse.redirect(new URL("/admin/login", request.url));
    return NextResponse.next();
  }

  const segments = pathname.split("/");
  const routeLocale = segments[1];
  if (!isLocale(routeLocale)) {
    const preferred = request.cookies.get(localeCookieName)?.value;
    const locale = isLocale(preferred) ? preferred : defaultLocale;
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${segments.slice(2).join("/")}`;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(localeHeaderName, routeLocale);
  const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  response.cookies.set(localeCookieName, routeLocale, { path: "/", maxAge: 31_536_000, sameSite: "lax" });
  return response;
}

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)"] };

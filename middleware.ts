import { NextRequest, NextResponse } from "next/server";
import { isLocale, preferredLocale } from "./i18n/config";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const saved = request.cookies.get("agrogo_locale")?.value;
  const preferred =
    saved && isLocale(saved)
      ? saved
      : preferredLocale(request.headers.get("accept-language"));
  if (path === "/")
    return NextResponse.redirect(
      new URL(`/${preferred}${request.nextUrl.search}`, request.url),
    );
  const segment = path.split("/")[1];
  const headers = new Headers(request.headers);
  headers.set("x-agrogo-locale", isLocale(segment) ? segment : preferred);
  return NextResponse.next({ request: { headers } });
}
export const config = {
  matcher: [
    "/((?!api|images|fonts|_next|assets|favicon|robots|sitemap|.*\\..*).*)",
  ],
};

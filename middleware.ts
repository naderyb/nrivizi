import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const maintenance = process.env.MAINTENANCE_MODE === "true";
  if (!maintenance) return NextResponse.next();

  const { pathname } = req.nextUrl;

  // Allow the maintenance page, notify API, Next internals, and static assets
  const allowed =
    pathname.startsWith("/maintenance") ||
    pathname.startsWith("/api/maintenance/notify") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    /\.(png|jpg|jpeg|gif|svg|ico|css|js|json|webp|avif|woff2?|ttf|eot)$/i.test(
      pathname
    );

  if (allowed) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/maintenance";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

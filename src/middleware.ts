import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";

  // Allow access to maintenance page and API routes
  if (
    request.nextUrl.pathname.startsWith("/maintenance") ||
    request.nextUrl.pathname.startsWith("/api/") ||
    request.nextUrl.pathname.startsWith("/_next/")
  ) {
    return NextResponse.next();
  }

  // Redirect to maintenance page if maintenance mode is active
  if (isMaintenanceMode) {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

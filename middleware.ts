import { NextResponse, NextRequest } from "next/server";
import * as jose from "jose";
import { isTokenExpired, UserPayload } from "./lib/auth";

// Define dashboard paths that should be protected
const DASHBOARD_PATHS = ["/dashboard"];

// Define admin-only path
const ADMIN_PATHS = ["/dashboard/settings"];

// JWT secret - same as in auth.ts
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Prepare the secret once, outside the function
const encoder = new TextEncoder();
const secret = encoder.encode(JWT_SECRET);

// Update the middleware function
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if the requested path is in the dashboard
  const isDashboardPath = DASHBOARD_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Check if the requested path is admin-only
  const isAdminPath = ADMIN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isDashboardPath) {
    // Get the auth token from cookies
    const token = req.cookies.get("auth_token")?.value;

    // If there's no token or expired token, redirect to login
    if (!token || isTokenExpired(token)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      // Verify the token using jose library which is Edge compatible
      const { payload } = await jose.jwtVerify(token, secret);
      const decoded = payload as UserPayload;

      // Check if user is an admin for admin-only paths
      if (isAdminPath && decoded.role !== "admin") {
        // Not an admin, redirect to dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // User is authenticated and has appropriate role, continue
      return NextResponse.next();
    } catch (error) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Not a dashboard path, continue
  return NextResponse.next();
}

// Configure the middleware to run for specific paths
export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};

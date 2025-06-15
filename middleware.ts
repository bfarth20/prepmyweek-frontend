import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define which paths require authentication
const protectedRoutes = [
  "/profile",
  "/grocery-list",
  "/add-recipe",
  "/stores",
  "/recipes",
  "/app",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if path is protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If not a protected route, allow through
  if (!isProtected) return NextResponse.next();

  // Read the auth token (you can change this to match your cookie name)
  const token = request.cookies.get("token")?.value;

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname); // Optional: support redirect after login
    return NextResponse.redirect(loginUrl);
  }

  // Otherwise, allow request
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile",
    "/stores/:path*",
    "/grocery-list/:path*",
    "/recipes/:path*",
    "/add-recipe",
  ],
};

// Import necessary modules for middleware
import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

/**
 * Middleware to protect routes that require authentication
 * Checks for a valid JWT token in the request cookies
 */
export function middleware(request: NextRequest) {
  // Define protected routes that require authentication
  const protectedPaths = [
    "/dashboard",
    "/profile",
    "/admin",
    "/teacher",
    "/user",
  ];

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    // Get the token from cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      // Redirect to login if no token is found
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // Verify the token
      verify(token, process.env.JWT_SECRET || "fallback-secret-key");
      // If token is valid, allow the request to proceed
    } catch (error) {
      // Redirect to login if token is invalid
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Allow the request to proceed for public routes or if authenticated
  return NextResponse.next();
}

// Define which paths the middleware should apply to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [{ type: "header", key: "next-router-state" }],
    },
  ],
};

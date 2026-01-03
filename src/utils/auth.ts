// Import necessary modules for user authentication utilities
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma client for database operations
const prisma = new PrismaClient();

/**
 * Retrieves the authenticated user from the JWT token in cookies
 * @returns User object if authenticated, null otherwise
 */
export async function getAuthenticatedUser() {
  // Get the authentication token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // Return null if no token is found
  if (!token) {
    return null;
  }

  try {
    // Verify the token and extract the user ID from the payload
    const payload = verify(
      token, 
      process.env.JWT_SECRET || "fallback-secret-key"
    ) as { userId: number };
    
    const userId = payload.userId;

    // Fetch user data from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    // Return user data if found, null otherwise
    return user;
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error verifying token:", error);
    return null;
  }
}
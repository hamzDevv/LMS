// Import necessary modules for the dashboard page
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { handleLogout } from "@/actions/auth-action";

// Initialize Prisma client for database operations
const prisma = new PrismaClient();

// Server component for the dashboard page
export default async function Dashboard() {
  // Get the authentication token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // Redirect to login if no token is found
  if (!token) {
    redirect("/login");
  }

  let userId: number;
  try {
    // Verify the token and extract the user ID from the payload
    const payload = verify(
      token,
      process.env.JWT_SECRET || "fallback-secret-key"
    ) as { userId: number };
    userId = payload.userId;
  } catch {
    // Redirect to login if token is invalid
    redirect("/login");
  }

  // Fetch user data from the database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  // Redirect to login if user is not found
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
        <div className="space-y-4">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-700">
              User Information
            </h2>
            <div className="mt-4 space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">ID:</span> {user.id}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Joined:</span>{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {/* Logout form using server action */}
          <form action={handleLogout}>
            <button
              type="submit"
              className="mt-6 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition duration-300"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

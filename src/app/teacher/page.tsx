import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { handleLogout } from "@/actions/auth-action";

const prisma = new PrismaClient();

export default async function TeacherDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let userId: number;
  try {
    const payload = verify(
      token,
      process.env.JWT_SECRET || "fallback-secret-key"
    ) as { userId: number };
    userId = payload.userId;
  } catch {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.role !== "TEACHER") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-green-400">
          Teacher Dashboard
        </h1>
        <div className="space-y-4">
          <div className="bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-600">
            <h2 className="text-xl font-semibold mb-4">Teacher Information</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium text-gray-400">Email:</span>{" "}
                {user.email}
              </p>
              <p>
                <span className="font-medium text-gray-400">Role:</span>{" "}
                {user.role}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/teacher/courses"
              className="p-4 bg-green-600 hover:bg-green-700 rounded-lg text-center transition"
            >
              My Courses
            </a>
            <a
              href="/teacher/profile"
              className="p-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-center transition"
            >
              My Profile
            </a>
          </div>
          <form action={handleLogout}>
            <button
              type="submit"
              className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

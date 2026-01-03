import Link from "next/link";

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/user"
          className="text-blue-400 hover:underline mb-4 inline-block"
        >
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold mb-6">My Enrolled Courses</h1>
        <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 text-center">
          <p className="text-gray-400">
            You are not enrolled in any courses yet.
          </p>
          <Link
            href="/course"
            className="mt-4 inline-block bg-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    </div>
  );
}

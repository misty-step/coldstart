import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

/**
 * Dashboard Page
 * 
 * Protected route that displays user information.
 * Demonstrates authentication state and protected routing.
 */
export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Welcome, {user?.firstName || "User"}!
          </h2>
          <p className="text-gray-600 mb-4">
            This is your protected dashboard. You&apos;re successfully authenticated.
          </p>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Your Info:</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Email:</dt>
                <dd className="text-gray-900">{user?.emailAddresses[0]?.emailAddress}</dd>
              </div>
              <div>
                <dt className="text-gray-500">User ID:</dt>
                <dd className="text-gray-900 font-mono">{userId}</dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
}

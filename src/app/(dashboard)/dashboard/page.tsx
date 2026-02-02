"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { identifyUser, trackUserActivated } from "@/lib/posthog";

/**
 * Dashboard Page
 * 
 * Protected route that displays user information.
 * Demonstrates authentication state and protected routing.
 */
export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Identify user in PostHog for analytics
      identifyUser(user.id, {
        email: user.emailAddresses[0]?.emailAddress,
        name: user.fullName,
      });
      
      // Track dashboard view as activation
      trackUserActivated({ feature: "dashboard_view" });
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Middleware will handle redirect
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Welcome Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:col-span-2 lg:col-span-2">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Welcome, {user?.firstName || "User"}!
            </h2>
            <p className="text-gray-600 mb-4">
              This is your protected dashboard. You&apos;re successfully authenticated
              with Cold Start.
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
                  <dd className="text-gray-900 font-mono text-xs">{user?.id}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                href="/dashboard/billing"
                className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Manage Billing
              </Link>
              <button
                disabled
                className="block w-full text-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-400 bg-gray-50 cursor-not-allowed"
              >
                Settings (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

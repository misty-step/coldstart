"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Billing Settings Page
 * 
 * Client component for managing billing and subscriptions.
 * Provides checkout and portal access buttons.
 */
export default function BillingPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      // In production, use your actual price ID
      const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO;
      
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/billing/portal", {
        method: "POST",
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Failed to create portal session");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Billing</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Current Plan */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Current Plan
            </h2>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">Free</p>
                <p className="text-sm text-gray-500">Basic features</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Active
              </span>
            </div>
            <button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : "Upgrade to Pro"}
            </button>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Payment Method
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Manage your payment methods and billing history through the Stripe
              customer portal.
            </p>
            <button
              onClick={handleManageBilling}
              disabled={isLoading}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : "Manage Billing"}
            </button>
          </div>
        </div>

        {/* Billing History */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Billing History
          </h2>
          <p className="text-sm text-gray-500">
            No invoices yet. Your billing history will appear here once you
            upgrade.
          </p>
        </div>
      </main>
    </div>
  );
}

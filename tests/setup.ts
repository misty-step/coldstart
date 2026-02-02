import "@testing-library/jest-dom";
import { vi } from "vitest";

/**
 * Test Setup
 * 
 * Global test configuration and mocks.
 */

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Clerk
vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    user: null,
    isLoaded: true,
    isSignedIn: false,
  }),
  useAuth: () => ({
    userId: null,
    sessionId: null,
    getToken: vi.fn(),
  }),
  SignedIn: ({ children }: { children: React.ReactNode }) => children,
  SignedOut: ({ children }: { children: React.ReactNode }) => children,
  SignInButton: ({ children }: { children: React.ReactNode }) => children,
  SignOutButton: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock environment variables
process.env.NEXT_PUBLIC_CONVEX_URL = "https://test.convex.cloud";
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test_";
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_test_";
process.env.NEXT_PUBLIC_POSTHOG_KEY = "ph_test_";

// Global test utilities
global.fetch = vi.fn();

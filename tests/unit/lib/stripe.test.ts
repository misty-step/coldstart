import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Stripe module before imports
vi.mock("@stripe/stripe-js", () => ({
  loadStripe: vi.fn(),
}));

import { getStripe } from "@/lib/stripe";
import { loadStripe } from "@stripe/stripe-js";

describe("Stripe Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset module cache to test singleton behavior
    vi.resetModules();
  });

  it("should return null when publishable key is not configured", async () => {
    const originalKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "";

    const stripe = await getStripe();
    expect(stripe).toBeNull();

    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = originalKey;
  });

  it("should load Stripe when key is configured", async () => {
    const mockStripe = { id: "mock-stripe" } as unknown as ReturnType<typeof loadStripe>;
    vi.mocked(loadStripe).mockResolvedValue(mockStripe);

    const originalKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_test_123";

    // Need to re-import to get fresh instance
    const { getStripe: freshGetStripe } = await import("@/lib/stripe");
    const stripe = await freshGetStripe();

    expect(loadStripe).toHaveBeenCalledWith("pk_test_123");
    expect(stripe).toBe(mockStripe);

    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = originalKey;
  });
});

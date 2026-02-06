import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/convex", () => ({
  isConvexConfigured: vi.fn(),
}));

vi.mock("@/lib/stripe-server", () => ({
  isStripeConfigured: vi.fn(),
}));

import { GET } from "@/app/api/health/route";
import { isConvexConfigured } from "@/lib/convex";
import { isStripeConfigured } from "@/lib/stripe-server";

describe("GET /api/health", () => {
  let originalClerkSecret: string | undefined;

  beforeEach(() => {
    vi.clearAllMocks();
    originalClerkSecret = process.env.CLERK_SECRET_KEY;
  });

  afterEach(() => {
    if (originalClerkSecret === undefined) {
      delete process.env.CLERK_SECRET_KEY;
      return;
    }
    process.env.CLERK_SECRET_KEY = originalClerkSecret;
  });

  it("returns healthy when all services configured", async () => {
    vi.mocked(isConvexConfigured).mockReturnValue(true);
    vi.mocked(isStripeConfigured).mockReturnValue(true);
    process.env.CLERK_SECRET_KEY = "sk_test";

    const response = GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("healthy");
  });

  it("returns degraded when some services configured", async () => {
    vi.mocked(isConvexConfigured).mockReturnValue(true);
    vi.mocked(isStripeConfigured).mockReturnValue(false);
    delete process.env.CLERK_SECRET_KEY;

    const response = GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("degraded");
  });

  it("returns unhealthy (503) when no services configured", async () => {
    vi.mocked(isConvexConfigured).mockReturnValue(false);
    vi.mocked(isStripeConfigured).mockReturnValue(false);
    delete process.env.CLERK_SECRET_KEY;

    const response = GET();
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.status).toBe("unhealthy");
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

import { headers } from "next/headers";
import { POST } from "@/app/api/webhooks/stripe/route";

describe("POST /api/webhooks/stripe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when missing stripe-signature header", async () => {
    vi.mocked(headers).mockResolvedValue(new Headers());

    const request = new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      body: "test",
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: "Missing stripe-signature header" });
  });

  it.todo("handles Stripe events (needs full Stripe mocking)");
});

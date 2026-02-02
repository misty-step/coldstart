import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

vi.mock("convex/browser", () => ({
  ConvexHttpClient: vi.fn().mockImplementation(function (this: { url: string }, url: string) {
    this.url = url;
  }),
}));

import { ConvexHttpClient } from "convex/browser";

const loadConvexModule = async () => {
  vi.resetModules();
  return await import("@/lib/convex");
};

describe("convex", () => {
  let originalConvexUrl: string | undefined;

  beforeEach(() => {
    vi.clearAllMocks();
    originalConvexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    if (originalConvexUrl === undefined) {
      delete process.env.NEXT_PUBLIC_CONVEX_URL;
      return;
    }
    process.env.NEXT_PUBLIC_CONVEX_URL = originalConvexUrl;
  });

  it("isConvexConfigured returns false when NEXT_PUBLIC_CONVEX_URL not set", async () => {
    delete process.env.NEXT_PUBLIC_CONVEX_URL;
    const { isConvexConfigured } = await loadConvexModule();

    expect(isConvexConfigured()).toBe(false);
  });

  it("isConvexConfigured returns true when set", async () => {
    vi.stubEnv("NEXT_PUBLIC_CONVEX_URL", "https://example.convex.cloud");
    const { isConvexConfigured } = await loadConvexModule();

    expect(isConvexConfigured()).toBe(true);
  });

  it("getConvexClient throws when URL not set", async () => {
    delete process.env.NEXT_PUBLIC_CONVEX_URL;
    const { getConvexClient } = await loadConvexModule();

    expect(() => getConvexClient()).toThrow("NEXT_PUBLIC_CONVEX_URL is not set");
  });

  it("getConvexClient returns ConvexHttpClient when URL set", async () => {
    const url = "https://example.convex.cloud";
    vi.stubEnv("NEXT_PUBLIC_CONVEX_URL", url);
    const { getConvexClient } = await loadConvexModule();

    const client = getConvexClient();

    expect(vi.mocked(ConvexHttpClient)).toHaveBeenCalledWith(url);
    expect(client).toEqual(expect.objectContaining({ url }));
  });
});

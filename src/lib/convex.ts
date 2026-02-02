import { ConvexHttpClient } from "convex/browser";

let convexClient: ConvexHttpClient | null = null;

export const isConvexConfigured = (): boolean =>
  Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);

export const getConvexClient = (): ConvexHttpClient => {
  if (convexClient) {
    return convexClient;
  }

  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not set");
  }

  convexClient = new ConvexHttpClient(url);
  return convexClient;
};

/**
 * Validate URL belongs to the application domain.
 * Prevents open redirect attacks in checkout/portal flows.
 */
export const isValidAppUrl = (url: string): boolean => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) return true; // Skip validation if not configured
  try {
    const parsed = new URL(url);
    const allowed = new URL(appUrl);
    return parsed.origin === allowed.origin;
  } catch {
    return false;
  }
};

export interface ConvexUser {
  _id: string;
  clerkId: string;
  email: string;
  name?: string;
  imageUrl?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: string;
  createdAt: number;
  updatedAt: number;
}

// Lazy-load API module once (not on every call)
let apiModule: typeof import("../../convex/_generated/api") | null = null;
const getApi = async () => {
  if (!apiModule) {
    apiModule = await import("../../convex/_generated/api");
  }
  return apiModule.api;
};

/**
 * Server-side Convex user operations.
 * Note: Mutations should only be called from server-side code (API routes, webhooks).
 */
export const convexUsers = {
  async getByClerkId(clerkId: string): Promise<ConvexUser | null> {
    const api = await getApi();
    const convex = getConvexClient();
    return convex.query(api.functions.users.getByClerkId, { clerkId });
  },

  async updateSubscription(args: {
    stripeCustomerId: string;
    stripeSubscriptionId?: string;
    status?: string;
  }): Promise<boolean> {
    const api = await getApi();
    const convex = getConvexClient();
    return convex.mutation(api.functions.users.updateSubscription, args);
  },
};

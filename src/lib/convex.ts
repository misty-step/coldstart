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

export const convexUsers = {
  async getByClerkId(clerkId: string): Promise<ConvexUser | null> {
    const { api } = await import("../../convex/_generated/api");
    const convex = getConvexClient();
    return convex.query(api.functions.users.getByClerkId, { clerkId });
  },

  async updateSubscription(args: {
    stripeCustomerId: string;
    stripeSubscriptionId?: string;
    status?: string;
  }): Promise<boolean> {
    const { api } = await import("../../convex/_generated/api");
    const convex = getConvexClient();
    return convex.mutation(api.functions.users.updateSubscription, args);
  },

  async create(args: {
    clerkId: string;
    email: string;
    name?: string;
    imageUrl?: string;
  }): Promise<string> {
    const { api } = await import("../../convex/_generated/api");
    const convex = getConvexClient();
    return convex.mutation(api.functions.users.create, args);
  },

  async update(args: {
    clerkId: string;
    name?: string;
    imageUrl?: string;
  }): Promise<boolean> {
    const { api } = await import("../../convex/_generated/api");
    const convex = getConvexClient();
    return convex.mutation(api.functions.users.update, args);
  },

  async remove(clerkId: string): Promise<boolean> {
    const { api } = await import("../../convex/_generated/api");
    const convex = getConvexClient();
    return convex.mutation(api.functions.users.remove, { clerkId });
  },
};

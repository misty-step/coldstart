 
/**
 * Generated Convex API - Stub types for development
 * Run `npx convex dev` to generate actual types from your schema
 */

import type { FunctionReference } from "convex/server";

// User function types from convex/functions/users.ts
type UserRecord = {
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
};

export declare const api: {
  functions: {
    users: {
      getByClerkId: FunctionReference<"query", "public", { clerkId: string }, UserRecord | null>;
      getById: FunctionReference<"query", "public", { id: string }, UserRecord | null>;
      create: FunctionReference<"mutation", "public", { clerkId: string; email: string; name?: string; imageUrl?: string }, string>;
      update: FunctionReference<"mutation", "public", { clerkId: string; name?: string; imageUrl?: string }, boolean>;
      updateStripeCustomerId: FunctionReference<"mutation", "public", { clerkId: string; stripeCustomerId: string }, boolean>;
      updateSubscription: FunctionReference<"mutation", "public", { stripeCustomerId: string; stripeSubscriptionId?: string; status?: string }, boolean>;
      remove: FunctionReference<"mutation", "public", { clerkId: string }, boolean>;
    };
  };
};

export declare const internal: {
  functions: {
    users: {
      createInternal: FunctionReference<
        "mutation",
        "internal",
        { clerkId: string; email: string; name?: string; imageUrl?: string },
        string
      >;
      updateInternal: FunctionReference<
        "mutation",
        "internal",
        { clerkId: string; name?: string; imageUrl?: string },
        boolean
      >;
      removeInternal: FunctionReference<
        "mutation",
        "internal",
        { clerkId: string },
        boolean
      >;
    };
  };
};

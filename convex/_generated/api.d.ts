/**
 * Stub - run `npx convex dev` to generate real types
 */
import type { FunctionReference } from "convex/server";

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
} | null;

export declare const api: {
  functions: {
    users: {
      getByClerkId: FunctionReference<
        "query",
        "public",
        { clerkId: string },
        UserRecord
      >;
      updateSubscription: FunctionReference<
        "mutation",
        "public",
        {
          stripeCustomerId: string;
          stripeSubscriptionId?: string;
          status?: string;
        },
        boolean
      >;
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
      updateStripeCustomerIdInternal: FunctionReference<
        "mutation",
        "internal",
        { clerkId: string; stripeCustomerId: string },
        boolean
      >;
    };
  };
};

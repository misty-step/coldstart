import type { MutationCtx } from "convex/server";
import { v } from "convex/values";
import { query, internalMutation } from "../_generated/server";

/**
 * User queries and mutations
 * 
 * Note: Clerk auth integration happens at the application layer.
 * Convex stores user data; Clerk handles authentication.
 */

/**
 * Get a user by Clerk ID
 */
export const getByClerkId = query({
  args: { clerkId: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("users"),
      clerkId: v.string(),
      email: v.string(),
      name: v.optional(v.string()),
      imageUrl: v.optional(v.string()),
      stripeCustomerId: v.optional(v.string()),
      stripeSubscriptionId: v.optional(v.string()),
      subscriptionStatus: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    return user;
  },
});

/**
 * Get a user by internal Convex ID
 */
export const getById = query({
  args: { id: v.id("users") },
  returns: v.union(
    v.object({
      _id: v.id("users"),
      clerkId: v.string(),
      email: v.string(),
      name: v.optional(v.string()),
      imageUrl: v.optional(v.string()),
      stripeCustomerId: v.optional(v.string()),
      stripeSubscriptionId: v.optional(v.string()),
      subscriptionStatus: v.optional(v.string()),
      createdAt: v.number(),
      updatedAt: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

type CreateUserArgs = {
  clerkId: string;
  email: string;
  name?: string;
  imageUrl?: string;
};

const createUserArgs = {
  clerkId: v.string(),
  email: v.string(),
  name: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
};

const createUser = async (ctx: MutationCtx, args: CreateUserArgs) => {
  const existing = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
    .unique();

  if (existing) {
    return existing._id;
  }

  const now = Date.now();
  const user = {
    clerkId: args.clerkId,
    email: args.email,
    createdAt: now,
    updatedAt: now,
    ...(args.name !== undefined ? { name: args.name } : {}),
    ...(args.imageUrl !== undefined ? { imageUrl: args.imageUrl } : {}),
  };
  return await ctx.db.insert("users", user);
};

export const createInternal = internalMutation({
  args: createUserArgs,
  returns: v.id("users"),
  handler: createUser,
});

type UpdateUserArgs = {
  clerkId: string;
  name?: string;
  imageUrl?: string;
};

const updateUserArgs = {
  clerkId: v.string(),
  name: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
};

const updateUser = async (ctx: MutationCtx, args: UpdateUserArgs) => {
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
    .unique();

  if (user === null) {
    throw new Error("User not found");
  }

  const update = {
    updatedAt: Date.now(),
    ...(args.name !== undefined ? { name: args.name } : {}),
    ...(args.imageUrl !== undefined ? { imageUrl: args.imageUrl } : {}),
  };
  await ctx.db.patch(user._id, update);
  return true;
};

export const updateInternal = internalMutation({
  args: updateUserArgs,
  returns: v.boolean(),
  handler: updateUser,
});

/**
 * Update Stripe customer ID
 */
export const updateStripeCustomerId = internalMutation({
  args: {
    clerkId: v.string(),
    stripeCustomerId: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (user === null) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      stripeCustomerId: args.stripeCustomerId,
      updatedAt: Date.now(),
    });
    return true;
  },
});

/**
 * Update subscription status
 */
export const updateSubscription = internalMutation({
  args: {
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_stripeCustomerId", (q) =>
        q.eq("stripeCustomerId", args.stripeCustomerId)
      )
      .unique();

    if (user === null) {
      console.warn(
        `updateSubscription: No user found for stripeCustomerId ${args.stripeCustomerId}`
      );
      return false;
    }

    await ctx.db.patch(user._id, {
      ...(args.stripeSubscriptionId && { stripeSubscriptionId: args.stripeSubscriptionId }),
      ...(args.status && { subscriptionStatus: args.status }),
      updatedAt: Date.now(),
    });
    return true;
  },
});

type RemoveUserArgs = { clerkId: string };

const removeUserArgs = { clerkId: v.string() };

const removeUser = async (ctx: MutationCtx, args: RemoveUserArgs) => {
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
    .unique();

  if (user === null) {
    return false;
  }

  await ctx.db.delete(user._id);
  return true;
};

export const removeInternal = internalMutation({
  args: removeUserArgs,
  returns: v.boolean(),
  handler: removeUser,
});

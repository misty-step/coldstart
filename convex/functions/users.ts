import { v } from "convex/values";
import { query, mutation } from "../_generated/server";

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

/**
 * Create a new user (called during sign-up via Clerk webhook)
 */
export const create = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) {
      return existing._id;
    }

    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
      createdAt: now,
      updatedAt: now,
    });
    return userId;
  },
});

/**
 * Update user profile
 */
export const update = mutation({
  args: {
    clerkId: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
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
      ...args,
      updatedAt: Date.now(),
    });
    return true;
  },
});

/**
 * Update Stripe customer ID
 */
export const updateStripeCustomerId = mutation({
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
export const updateSubscription = mutation({
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
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      ...(args.stripeSubscriptionId && { stripeSubscriptionId: args.stripeSubscriptionId }),
      ...(args.status && { subscriptionStatus: args.status }),
      updatedAt: Date.now(),
    });
    return true;
  },
});

/**
 * Delete user (called on Clerk user.deleted webhook)
 */
export const remove = mutation({
  args: { clerkId: v.string() },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (user === null) {
      return false;
    }

    await ctx.db.delete(user._id);
    return true;
  },
});

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Cold Start - Convex Schema
 * 
 * Users table with Clerk integration for auth.
 * Follows Misty Step tenets: Simplicity, Explicitness, Maintainability.
 */

export default defineSchema({
  users: defineTable({
    // Clerk user ID (external reference)
    clerkId: v.string(),
    
    // User profile
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    
    // Stripe billing
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    subscriptionStatus: v.optional(v.union(
      v.literal("active"),
      v.literal("canceled"),
      v.literal("incomplete"),
      v.literal("incomplete_expired"),
      v.literal("past_due"),
      v.literal("paused"),
      v.literal("trialing"),
      v.literal("unpaid")
    )),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_stripeCustomerId", ["stripeCustomerId"]),
});

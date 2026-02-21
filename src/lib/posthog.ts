import posthog from "posthog-js";

/**
 * PostHog Analytics
 * 
 * Client-side analytics for tracking user behavior and events.
 * Events follow SPEC standard: user_signed_up, user_activated, etc.
 */

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest";

/**
 * Initialize PostHog (called once in provider)
 */
export function initPostHog(): void {
  if (typeof window === "undefined") return;
  
  if (!POSTHOG_KEY) {
    console.warn("PostHog key not configured");
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    ui_host: "https://us.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
    respect_dnt: true,
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") {
        // Debug mode in development
        posthog.debug();
      }
    },
  });
}

/**
 * Get PostHog instance
 */
export function getPostHog() {
  return posthog;
}

/**
 * Identify user (call after sign-in)
 */
export function identifyUser(userId: string, properties?: Record<string, unknown>): void {
  if (!POSTHOG_KEY) return;
  posthog.identify(userId, properties);
}

/**
 * Reset user identification (call on sign-out)
 */
export function resetUser(): void {
  if (!POSTHOG_KEY) return;
  posthog.reset();
}

/**
 * Track custom event
 */
export function trackEvent(eventName: string, properties?: Record<string, unknown>): void {
  if (!POSTHOG_KEY) return;
  posthog.capture(eventName, properties);
}

/**
 * Standard events as per SPEC
 */
export const AnalyticsEvents = {
  USER_SIGNED_UP: "user_signed_up",
  USER_ACTIVATED: "user_activated",
  SUBSCRIPTION_STARTED: "subscription_started",
  SUBSCRIPTION_CANCELLED: "subscription_cancelled",
  FEATURE_USED: "feature_used",
} as const;

/**
 * Track user signup
 */
export function trackUserSignedUp(properties?: { method?: string; [key: string]: unknown }): void {
  trackEvent(AnalyticsEvents.USER_SIGNED_UP, properties);
}

/**
 * Track user activation (first meaningful action)
 */
export function trackUserActivated(properties?: { feature?: string; [key: string]: unknown }): void {
  trackEvent(AnalyticsEvents.USER_ACTIVATED, properties);
}

/**
 * Track subscription start
 */
export function trackSubscriptionStarted(properties?: { 
  plan?: string; 
  price?: number; 
  currency?: string;
  [key: string]: unknown;
}): void {
  trackEvent(AnalyticsEvents.SUBSCRIPTION_STARTED, properties);
}

/**
 * Track subscription cancellation
 */
export function trackSubscriptionCancelled(properties?: { 
  plan?: string; 
  reason?: string;
  [key: string]: unknown;
}): void {
  trackEvent(AnalyticsEvents.SUBSCRIPTION_CANCELLED, properties);
}

/**
 * Track feature usage
 */
export function trackFeatureUsed(featureName: string, properties?: Record<string, unknown>): void {
  trackEvent(AnalyticsEvents.FEATURE_USED, { feature: featureName, ...properties });
}

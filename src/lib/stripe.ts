import { loadStripe, Stripe } from "@stripe/stripe-js";

/**
 * Stripe Client
 * 
 * Browser-side Stripe.js loader for checkout and customer portal.
 */

let stripePromise: Promise<Stripe | null>;

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.warn("Stripe publishable key not configured");
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
}

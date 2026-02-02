import Stripe from "stripe";

/**
 * Stripe Server
 * 
 * Server-side Stripe SDK instance for API routes and webhooks.
 */

const secretKey = process.env.STRIPE_SECRET_KEY;

export const stripe = secretKey
  ? new Stripe(secretKey, {
      apiVersion: "2025-01-27.acacia",
      typescript: true,
    })
  : null;

/**
 * Check if Stripe is configured
 */
export function isStripeConfigured(): boolean {
  return !!stripe && !!process.env.STRIPE_WEBHOOK_SECRET;
}

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
}: {
  customerId?: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  if (!stripe) {
    throw new Error("Stripe not configured");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    ...(customerId ? { customer: customerId } : {}),
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
}

/**
 * Create a customer portal session
 */
export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  if (!stripe) {
    throw new Error("Stripe not configured");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, isStripeConfigured } from "@/lib/stripe-server";
import { convexUsers } from "@/lib/convex";

/**
 * Checkout Session API
 * 
 * Creates a Stripe Checkout session for subscription.
 * Protected route - requires authentication.
 */

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: "Billing not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { priceId, successUrl, cancelUrl } = body;

    if (!priceId || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: "Missing required fields: priceId, successUrl, cancelUrl" },
        { status: 400 }
      );
    }

    const user = await convexUsers.getByClerkId(userId);
    const customerId = user?.stripeCustomerId;

    const session = await createCheckoutSession({
      customerId,
      priceId,
      successUrl,
      cancelUrl,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("Error creating checkout session:", error.message);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

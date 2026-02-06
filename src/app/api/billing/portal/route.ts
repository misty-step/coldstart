import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createPortalSession, isStripeConfigured } from "@/lib/stripe-server";
import { convexUsers, isValidAppUrl } from "@/lib/convex";

/**
 * Customer Portal API
 * 
 * Creates a Stripe Customer Portal session for managing subscriptions.
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
    const { returnUrl } = body;

    if (!returnUrl) {
      return NextResponse.json(
        { error: "Missing required field: returnUrl" },
        { status: 400 }
      );
    }

    if (!isValidAppUrl(returnUrl)) {
      return NextResponse.json(
        { error: "Invalid returnUrl" },
        { status: 400 }
      );
    }

    const user = await convexUsers.getByClerkId(userId);
    const customerId = user?.stripeCustomerId;

    if (!customerId) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    const session = await createPortalSession({
      customerId,
      returnUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("Error creating portal session:", error.message);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}

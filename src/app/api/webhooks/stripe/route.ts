import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe-server";
import Stripe from "stripe";
import { convexUsers } from "@/lib/convex";

/**
 * POST /api/webhooks/stripe
 * 
 * Handles Stripe webhook events for subscription lifecycle management.
 * This endpoint is public (no auth required) as it's called by Stripe.
 */
export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  try {
    if (!stripe) {
      throw new Error("Stripe not configured");
    }
    
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log(`Processing Stripe webhook: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        
        // Retrieve the subscription details
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          // Update user in database with subscription info
          await convexUsers.updateSubscription({
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscription.id,
            status: subscription.status,
          });

          console.log(`Subscription created: ${subscription.id}`);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string };
        
        // Update subscription status
        if (invoice.subscription) {
          console.log(`Payment succeeded for subscription: ${invoice.subscription}`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string };
        
        // Handle failed payment
        console.log(`Payment failed for subscription: ${invoice.subscription}`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        
        // Update subscription status in database
        await convexUsers.updateSubscription({
          stripeCustomerId: subscription.customer as string,
          stripeSubscriptionId: subscription.id,
          status: subscription.status,
        });

        console.log(`Subscription updated: ${subscription.id}, status: ${subscription.status}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        
        // Mark subscription as cancelled in database
        await convexUsers.updateSubscription({
          stripeCustomerId: subscription.customer as string,
          stripeSubscriptionId: subscription.id,
          status: "canceled",
        });

        console.log(`Subscription cancelled: ${subscription.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error handling Stripe webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}

/**
 * Required for Stripe webhook configuration
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

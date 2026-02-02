import { NextResponse } from "next/server";
import { isConvexConfigured } from "@/lib/convex";
import { isStripeConfigured } from "@/lib/stripe-server";

type ServiceHealth = {
  status: "ok" | "error";
  configured: boolean;
};

const toServiceHealth = (configured: boolean): ServiceHealth => ({
  status: configured ? "ok" : "error",
  configured,
});

export function GET() {
  const convexConfigured = isConvexConfigured();
  const stripeConfigured = isStripeConfigured();
  const clerkConfigured = Boolean(process.env.CLERK_SECRET_KEY);

  const services = {
    convex: toServiceHealth(convexConfigured),
    stripe: toServiceHealth(stripeConfigured),
    clerk: toServiceHealth(clerkConfigured),
  };

  const configuredCount = [
    convexConfigured,
    stripeConfigured,
    clerkConfigured,
  ].filter(Boolean).length;

  const status =
    configuredCount === 0
      ? "unhealthy"
      : configuredCount === 3
        ? "healthy"
        : "degraded";

  const statusCode = status === "unhealthy" ? 503 : 200;

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      services,
    },
    { status: statusCode }
  );
}

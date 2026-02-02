import * as Sentry from "@sentry/nextjs";

/**
 * Next.js Instrumentation
 * 
 * Registers Sentry for the Node.js runtime.
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;

import * as Sentry from "@sentry/nextjs";

/**
 * Sentry Edge Configuration
 * 
 * Error tracking for Edge runtime (middleware, edge API routes).
 */

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  sendDefaultPii: false,

  // Environment
  environment: process.env.NODE_ENV,
});

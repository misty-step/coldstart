import * as Sentry from "@sentry/nextjs";

/**
 * Sentry Server Configuration
 * 
 * Error tracking and performance monitoring for the server.
 */

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Environment
  environment: process.env.NODE_ENV,

  // Enable debug in development
  debug: process.env.NODE_ENV === "development",
});

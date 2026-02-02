import * as Sentry from "@sentry/nextjs";

/**
 * Sentry Client Configuration
 * 
 * Error tracking and performance monitoring for the browser.
 */

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Setting this option to true will print useful information to the console
    debug: process.env.NODE_ENV === "development",

    // Replay configuration
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,

    // Before send hook to filter out certain errors
    beforeSend(event) {
      // Filter out specific errors if needed
      return event;
    },
  });
} else {
  console.warn("Sentry DSN not configured - error tracking disabled");
}

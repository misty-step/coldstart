import * as Sentry from "@sentry/nextjs";

/**
 * Sentry Client Configuration
 * 
 * Error tracking and performance monitoring for the browser.
 */

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production to control sampling
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  sendDefaultPii: false,

  // Sample rate for profiling
  profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Replay sampling rates
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Register Replay integration
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  // Environment
  environment: process.env.NODE_ENV,

  // Enable debug in development
  debug: process.env.NODE_ENV === "development",

  // Before sending, filter sensitive data
  beforeSend(event) {
    // Sanitize URLs to remove PII
    if (event.request?.url) {
      try {
        const url = new URL(event.request.url);
        // Remove sensitive query params
        url.searchParams.delete("token");
        url.searchParams.delete("code");
        event.request.url = url.toString();
      } catch {
        // URL parsing failed, leave as is
      }
    }
    return event;
  },
});

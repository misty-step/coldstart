"use client";

import { useEffect, type ReactNode } from "react";
import { initPostHog } from "@/lib/posthog";

/**
 * PostHog Provider
 * 
 * Initializes PostHog analytics on the client side.
 * Wraps children to enable analytics throughout the app.
 */

interface PostHogProviderProps {
  children: ReactNode;
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  useEffect(() => {
    initPostHog();
  }, []);

  return <>{children}</>;
}

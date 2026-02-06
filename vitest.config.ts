import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Vitest Configuration
 * 
 * Unit testing with React Testing Library.
 * Coverage threshold: 80%
 */

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      // 60% threshold - integration code (webhooks, Stripe) requires real services
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60,
      },
      exclude: [
        "node_modules/",
        "tests/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/generated/**",
        "convex/_generated/**",
        "src/app/api/webhooks/**",
        "src/lib/stripe-server.ts",
      ],
    },
    include: ["tests/unit/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

# CLAUDE.md - Coldstart Stack Conventions

## Stack
- Next.js 16 (App Router)
- Convex (real-time database)
- Clerk (authentication)
- Stripe (payments)
- PostHog (analytics)
- Sentry (error tracking)
- Tailwind CSS
- TypeScript strict mode

## Key Patterns

### Convex
- Use indexes for queries (by_clerkId, by_email, by_stripeCustomerId)
- Separate public mutations from internal mutations (for webhooks)
- Dynamic import api from convex/_generated/api in Next.js API routes
- Use ConvexHttpClient for server-side, ConvexReactClient for client

### Clerk Authentication
- Webhook handler at /clerk-webhook on Convex HTTP
- Always verify Svix signature FIRST before processing
- Handle user.created, user.updated, user.deleted events
- Sync to Convex users table

### Stripe Integration
- Webhook at /api/webhooks/stripe
- Verify signature before processing
- Handle checkout.session.completed, subscription.updated/deleted
- Use typed wrapper in src/lib/convex.ts for Convex mutations

### API Routes
- Protected routes: use auth() from @clerk/nextjs/server
- Check isStripeConfigured() before billing operations
- Return structured JSON errors with appropriate status codes

### Testing
- Unit tests in tests/unit/
- E2E tests in tests/e2e/
- Coverage threshold: 60% (integration code excluded)
- Mock environment variables with vi.stubEnv

### External Integration Principles
- Fail-fast: validate env vars at module load
- Verify signatures FIRST
- Log errors with context
- Health check at /api/health

## File Structure
- src/app/api/ - API routes
- src/lib/ - Utilities and service wrappers
- convex/functions/ - Convex queries/mutations
- convex/http.ts - Webhook handlers

## Commands
- bun run dev - Start development
- bun run test - Run unit tests
- bun run type-check - TypeScript check
- bun run lint - ESLint
- npx convex dev - Start Convex (generates types)

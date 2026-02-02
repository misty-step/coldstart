# Cold Start — Specification

## Overview
Opinionated Next.js starter for shipping fast. The Misty Step stack.

## Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict mode)
- **Database:** ConvexDB (real-time)
- **Auth:** Clerk
- **Payments:** Stripe
- **Analytics:** PostHog (single project, filter by $host)
- **Errors:** Sentry
- **Styling:** Tailwind CSS
- **Testing:** Vitest (unit), Playwright (e2e)

## Initial Structure

```
coldstart/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── (dashboard)/
│   │   │   └── dashboard/
│   │   └── api/
│   │       └── webhooks/
│   │           └── stripe/
│   ├── components/
│   │   ├── ui/
│   │   └── providers/
│   ├── lib/
│   │   ├── stripe.ts
│   │   ├── posthog.ts
│   │   └── utils.ts
│   └── convex/
│       ├── _generated/
│       ├── schema.ts
│       └── functions/
├── tests/
│   ├── unit/
│   └── e2e/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── convex.json
├── .env.example
└── README.md
```

## Configuration Files Needed

### .env.example
```
# Convex
NEXT_PUBLIC_CONVEX_URL=
CONVEX_DEPLOY_KEY=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Sentry
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

## Key Patterns

### Error Handling
Use EnhancedError pattern from Phaedrus's claude-config:
- Categorized errors (timeout, rate_limit, auth, network, api, validation, quota, unknown)
- Retry with exponential backoff
- Structured logging

### PostHog Events (Standard)
- `user_signed_up`
- `user_activated`
- `subscription_started`
- `subscription_cancelled`
- `feature_used`

### Stripe Integration
- Checkout sessions
- Customer portal
- Webhook handling
- Subscription lifecycle

## CI/CD Requirements

### PR Checks
- TypeScript type check
- ESLint
- Unit tests (Vitest)
- Coverage threshold (80%)

### Deploy
- Vercel deployment
- Convex deployment
- Environment validation

## Priority Order
1. Next.js + TypeScript foundation
2. ConvexDB setup with basic schema
3. Clerk auth integration
4. Stripe billing skeleton
5. PostHog integration
6. Sentry error logging
7. Test infrastructure
8. CI/CD workflows
9. (LATER) Design token system

## Notes
- Design system is last priority — focus on technical foundation
- Follow tenets: Simplicity, Modularity, Explicitness, Maintainability, Observability
- CLI-first approach for all integrations

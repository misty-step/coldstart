# Cold Start

An opinionated Next.js starter for shipping fast. The Misty Step stack.

## Stack

- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **Language:** TypeScript (strict mode)
- **Database:** [Convex](https://convex.dev/) (real-time)
- **Auth:** [Clerk](https://clerk.com/)
- **Payments:** [Stripe](https://stripe.com/)
- **Analytics:** [PostHog](https://posthog.com/)
- **Errors:** [Sentry](https://sentry.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Testing:** Vitest (unit), Playwright (e2e)

## Feature Status

- ✅ Working - Fully integrated and tested
- 🚧 Scaffold - Code exists but needs configuration
- 📋 Planned - On roadmap

- ✅ Next.js App Router
- ✅ TypeScript strict
- 🚧 Convex database - run `npx convex dev` to generate types, set `.env.local`
- 🚧 Clerk auth - webhook handler ready, needs `.env.local` + dashboard config
- 🚧 Stripe payments - webhook + checkout ready, needs `.env.local` + products
- 🚧 PostHog analytics - provider ready, needs API key
- 🚧 Sentry errors - config ready, needs DSN
- ✅ Tailwind CSS
- ✅ Vitest testing
- 🚧 Playwright e2e - config ready, needs tests
- ✅ CI/CD - GitHub Actions

## Tenets

- **Simplicity** - Keep it simple, avoid over-engineering
- **Modularity** - Components and functions are self-contained
- **Explicitness** - Code is clear about what it does
- **Maintainability** - Easy to understand and modify
- **Observability** - Comprehensive logging and monitoring

## Quick Start

1. Clone
    ```bash
    git clone <repo-url> my-app
    cd my-app
    ```
2. Install
    ```bash
    bun install
    ```
3. Copy env
    ```bash
    cp .env.example .env.local
    ```
4. Configure services (Convex, Clerk, Stripe - each needs dashboard setup)
5. Run
    ```bash
    bun run dev
    npx convex dev
    ```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Development

```bash
# Start development server
npm run dev

# Run type check
npm run type-check

# Run linter
npm run lint

# Run unit tests
npm run test

# Run unit tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e

# Run e2e tests with UI
npm run test:e2e:ui
```

## Project Structure

```
coldstart/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/         # Auth route group
│   │   ├── (dashboard)/    # Dashboard route group
│   │   └── api/            # API routes
│   ├── components/
│   │   ├── ui/             # UI components
│   │   └── providers/      # Context providers
│   └── lib/                # Utility functions
├── convex/                 # Convex database
│   ├── functions/          # Convex functions
│   ├── schema.ts           # Database schema
│   └── http.ts             # HTTP actions
├── tests/
│   ├── unit/               # Vitest unit tests
│   └── e2e/                # Playwright e2e tests
└── .github/workflows/      # CI/CD workflows
```

## Configuration

### Convex

1. Create a project at [convex.dev](https://convex.dev/)
2. Run `npx convex dev` to start the dev server
3. Copy the deployment URL to `NEXT_PUBLIC_CONVEX_URL`

### Clerk

1. Create an application at [clerk.com](https://clerk.com/)
2. Copy the Publishable Key and Secret Key to your `.env.local`
3. Configure the webhook URL in Clerk dashboard

### Stripe

1. Create an account at [stripe.com](https://stripe.com/)
2. Copy your API keys to `.env.local`
3. Create products and prices in the Stripe dashboard
4. Copy price IDs to `STRIPE_PRICE_ID_PRO` and `STRIPE_PRICE_ID_TEAM`
5. Configure webhook endpoint to `/api/webhooks/stripe`

### PostHog

1. Create a project at [posthog.com](https://posthog.com/)
2. Copy the Project API Key to `NEXT_PUBLIC_POSTHOG_KEY`

### Sentry

1. Create a project at [sentry.io](https://sentry.io/)
2. Copy the DSN to `SENTRY_DSN`
3. Create an auth token for source map uploads

## CI/CD

GitHub Actions workflows are configured for:

- **CI** (`.github/workflows/ci.yml`): Runs on PRs
  - TypeScript type checking
  - ESLint
  - Unit tests with 80% coverage threshold
  - Build verification

- **Deploy** (`.github/workflows/deploy.yml`): Runs on main branch
  - Environment validation
  - Build and deploy to production
  - Convex deployment

## License

MIT

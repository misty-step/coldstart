# Coldstart

> The Next.js boilerplate for indie hackers who'd rather ship than configure.

## Vision

Solve the cold start problem. Go from `git clone` to deployed SaaS with payments, auth, and a landing page in under an hour. Not a tutorial—a working product you own.

## The Market

**ShipFast** by Mark Lou proves the model:
- $17K/mo revenue
- $200-300 per purchase (pay once, build unlimited)
- Zero marginal cost after initial build

The vibe coder explosion created massive demand. People who can prompt their way to features but don't want to configure Stripe webhooks or set up OAuth flows. They'll pay $200-300 to skip the boring parts.

**Why this is defensible** (despite being "just code"):
1. **Documentation quality** - The code is table stakes; the docs are the product
2. **Community/ecosystem** - ShipFast has 5,000 makers in Discord
3. **Ongoing updates** - Framework versions change, integrations break
4. **Trust/brand** - Mark Lou has credibility; buyers trust it works
5. **Time arbitrage** - $200 vs 20 hours of setup = $10/hr value proposition

## Competitive Landscape

| Product | Price | Stack | Differentiator |
|---------|-------|-------|----------------|
| ShipFast | $200-300 | Next.js, Stripe, MongoDB/Supabase | Largest community, Mark Lou brand |
| Shipped.club | $149 | Next.js, Prisma | Cheaper |
| SaasRock | $149-499 | Remix | Remix-focused |
| Divjoy | $169 | Next.js/Gatsby | Visual builder |

**Gap in market:** None of these are opinionated about AI tooling. None ship with Claude Code integration, agent configurations, or LLM-ready patterns.

## Coldstart Differentiators

### 1. Claude Code Native

Ship with:
- `.claude/` directory with useful commands
- CLAUDE.md tailored to the boilerplate
- Pre-configured agents for common tasks
- Skills for deployment, debugging, etc.

"Your AI pair programmer already knows your codebase."

### 2. Misty Step Stack (Opinionated)

Our production-tested choices:
- **Framework:** Next.js 15 (App Router)
- **Database:** Convex (real-time, no migrations)
- **Auth:** Clerk (best DX, generous free tier)
- **Payments:** Stripe (with proper webhook handling)
- **Styling:** Tailwind + shadcn/ui
- **Analytics:** PostHog
- **Error tracking:** Sentry
- **Deployment:** Vercel

No MongoDB vs Postgres debates. No "also supports X." One stack, done right.

### 3. AI-First Patterns

- LLM gateway setup (model routing, fallbacks)
- Prompt management patterns
- Usage tracking and rate limiting
- Cost estimation helpers

Every SaaS will have AI features. We include the plumbing.

### 4. Documentation That Ships

- Setup guide (clone → deploy in one sitting)
- Architecture decisions explained (why Convex over Prisma)
- Common customizations documented
- Video walkthroughs for complex flows

## What's Included

### Core Infrastructure
- [ ] Next.js 15 App Router setup
- [ ] Convex database with schema patterns
- [ ] Clerk authentication (social + email)
- [ ] Stripe integration (one-time + subscriptions)
- [ ] Webhook handling patterns
- [ ] Environment variable management

### UI Components
- [ ] Landing page (hero, features, pricing, FAQ)
- [ ] Dashboard shell with sidebar navigation
- [ ] Settings pages (profile, billing, team)
- [ ] Auth pages (sign in, sign up, forgot password)
- [ ] Marketing components (testimonials, CTA sections)
- [ ] shadcn/ui pre-configured

### Developer Experience
- [ ] TypeScript strict mode
- [ ] ESLint + Prettier configured
- [ ] Husky pre-commit hooks
- [ ] GitHub Actions CI/CD
- [ ] Vercel deployment config
- [ ] Environment templates (.env.example)

### Claude Code Integration
- [ ] CLAUDE.md with project context
- [ ] Common commands (/deploy, /debug, /add-feature)
- [ ] Agent configurations
- [ ] Codebase documentation for AI navigation

### Extras
- [ ] SEO setup (meta tags, sitemap, robots.txt)
- [ ] Analytics integration (PostHog)
- [ ] Error tracking (Sentry)
- [ ] Email templates (welcome, password reset)
- [ ] Terms of Service / Privacy Policy templates
- [ ] Changelog infrastructure

## Pricing Strategy

**One-time purchase model** (like ShipFast):
- **Starter:** $149 - Core boilerplate, docs, updates
- **Pro:** $199 - + Claude Code integration, video guides
- **Team:** $299 - + Discord community, office hours

Lower than ShipFast to capture price-sensitive segment while building reputation.

**Future revenue streams:**
- Premium components (admin dashboards, team features)
- Video course upsell
- Consulting/setup services
- Affiliate revenue from recommended services

## Distribution Strategy

1. **Twitter/X organic** - Build in public, share progress
2. **Product Hunt launch** - One-time spike, credibility
3. **SEO** - "Next.js boilerplate," "SaaS starter kit" keywords
4. **GitHub** - Open source subset for discovery
5. **YouTube** - Tutorial content, algorithm play

## Build Plan

### Phase 1: Core (Week 1-2)
Extract and clean patterns from existing Misty Step projects:
- Next.js + Convex + Clerk + Stripe integration
- Basic landing page
- Dashboard shell
- Documentation skeleton

### Phase 2: Polish (Week 3)
- Claude Code integration
- Video walkthroughs
- Marketing site
- Payment/licensing setup

### Phase 3: Launch (Week 4)
- Product Hunt preparation
- Twitter announcement
- First customers
- Feedback loop

## Open Questions

- [ ] Licensing: Lemon Squeezy vs Gumroad vs direct Stripe?
- [ ] Community: Discord from day 1 or wait for critical mass?
- [ ] Open source: Full repo public with honor system, or private repo with access?
- [ ] Updates: How to deliver updates to purchased customers?
- [ ] Support: What's the support commitment?

## Success Metrics

**MVP success:** 10 sales in first month ($1,500 revenue)
**Real validation:** $5K MRR within 6 months
**ShipFast parity:** $15K MRR (stretch goal)

## Why Now

1. AI coding tools are mainstream—vibe coders are a real market
2. We have the stack expertise from building Misty Step products
3. Claude Code integration is a genuine differentiator nobody else has
4. Low effort to extract what we've already built
5. Zero marginal cost revenue stream

---

## Inspiration

> "Whoever puts a normie wrapper around this is going to be a fucking millionaire."

Same energy. Wrap our expertise in a box normies can buy.

---

*Coldstart: From zero to shipped.*

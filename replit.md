# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Fitest Artifact (`artifacts/fitest`)

React + Vite B2B performance benchmarking platform. Royal Blue + White theme.

### Key files
- `src/pages/Home.tsx` — landing page, audit flow (consent → 20 Qs → results), 3-page print report, affiliate partner section
- `src/pages/Dashboard.tsx` — licensed org dashboard (Business + Gym modes), audit link generator, affiliate programme panel
- `src/pages/Login.tsx` — locked to `demo@fitest.co.uk` / `demo123`; all other credentials return a "contact us" error
- `src/pages/Onboarding.tsx` — new org setup, generates clientId, saves `fitest_org` to localStorage
- `src/lib/auditData.ts` — 20-question audits (Business + Gym), tier thresholds, `getTier()` helper
- `src/index.css` — Royal Blue CSS custom properties

### Auth model (localStorage-only, no backend)
- `fitest_auth` — `{ email }` — set on login, cleared on sign-out
- `fitest_org` — `{ name, type, clientId }` — set on login / onboarding
- `fitest_results` — array of audit result records (clientId, score, tier, auditType, refId?, …)
- `fitest_ref` — affiliate referral ID captured from `?ref=` query param, persisted across sessions

### Demo access
- URL: `/dashboard?demo=1` — no login required, opens as Demo Gym (clientId DEMO123, Gym mode)
- Login: `demo@fitest.co.uk` / `demo123` — sets org and navigates to dashboard

### Affiliate system
- Gym dashboard shows Affiliate Programme panel (link, commission 20%/£249, payout 1st monthly, stats)
- Homepage has "Become an Affiliate Partner" section between Pricing and Consent
- `?ref=GYM_ID` on any page stores the referral ID in `fitest_ref` localStorage and attaches it to every audit submission record

### Stripe links
- Business licence: `https://buy.stripe.com/8x29ASdLL99z3ycbMX6AM05`
- Gym licence: `https://buy.stripe.com/fZudR89vvdpP9WA9EP6AM06`

### Company details
- Fitest / Leadsopedia Limited | Company No. 13145058 | hello@fitest.co.uk

### Tier colours
- Critical → red-500, Exposed → amber-500, Performing → primary (royal blue), Elite → emerald-500

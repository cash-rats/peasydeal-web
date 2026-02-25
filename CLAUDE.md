# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PeasyDeal is an e-commerce web application built with **Remix v1** (v1.16), React 18, and TypeScript. It sells deal/discount products with Stripe and PayPal payment integrations.

## Commands

### Development
```bash
npm run dev                # Start dev server (runs CSS pipeline + Remix concurrently)
npm run dev:patched        # Alternative: runs sass, postcss, css, and remix dev concurrently
```

### Build
```bash
npm run build              # Full production build (sass → postcss → tailwind → remix build)
npm run build:patched      # Same steps explicitly
```

### Testing
```bash
npm run test               # Run vitest (unit tests)
npm run test:e2e:dev       # Open Cypress for interactive E2E testing
npm run test:e2e:run       # Run Cypress E2E tests headlessly (port 8811)
```

### Linting & Formatting
```bash
npm run lint               # ESLint
npm run format             # Prettier
npm run typecheck          # TypeScript type checking (tsc -b)
npm run validate           # All checks: test, lint, typecheck, e2e
```

### Deployment (via Makefile)
```bash
make build/staging         # Build Docker image for staging
make deploy/staging        # Deploy to staging
make build/prod            # Build Docker image for production
make deploy/prod           # Deploy to production
```

## Architecture

### Framework & Rendering
- **Remix v1** with file-based routing in `app/routes/`
- Server-side rendering with **MUI ThemeProvider** and **Emotion** for CSS-in-JS SSR
- The `entry.server.tsx` does a two-pass render to extract Emotion styles
- `entry.client.tsx` hydrates with Emotion cache and MUI theme
- **ChakraProvider** wraps the app in `root.tsx` (co-exists with MUI)

### CSS Pipeline (three layers, processed in order)
1. **SCSS** → compiled via `sass` (source files: `*.scss` alongside components)
2. **PostCSS** → processes the compiled CSS with autoprefixer
3. **Tailwind CSS** → generates `app/styles/tailwind.css` (Tailwind v3, `important: true`)

SCSS breakpoint mixins are defined in `app/styles/_mixins.scss` and `app/styles/_breakpoints.scss`. Components have co-located `styles/` directories containing `.scss`, `.css`, and `.css.map` files.

### shadcn/ui Components
Configured via `components.json` (new-york style, lucide icons). UI primitives live in `app/components/ui/`. Uses `~/lib/utils` for the `cn()` utility (clsx + tailwind-merge).

### Path Alias
`~/*` maps to `./app/*` (configured in `tsconfig.json`).

### Routing Structure
- `app/routes/__index.tsx` — Layout route with Header, Footer, CategoriesNav, and search
- `app/routes/__index/index.tsx` — Home page
- `app/routes/__index/product/` — Product detail pages
- `app/routes/__index/$collection/` — Category pages
- `app/routes/cart/`, `checkout/`, `payment/`, `tracking/` — Purchase flow
- `app/routes/blog/` — Blog (Contentful CMS)
- `app/routes/$.tsx` — Global 404 catch-all

Product detail URLs follow the pattern: `/product/product-slug-i.{VARIATION_UID}`

### Data Layer
- **Prisma** (SQLite) — `app/db.server.ts`, schema in `prisma/schema.prisma`
- **Redis** (ioredis) — `app/redis.server.ts` for sessions and caching
- Both use the global singleton pattern to prevent connection leaks in dev

### Session Management
Session handling in `app/sessions/` with Redis-backed sessions. Shopping cart stored in cookies (`app/cookies.ts`).

### API & External Services
- `app/api/` — Server-side API functions (categories, product search, email activation)
- **Algolia** — Search and autocomplete
- **Contentful** — Blog CMS
- **Stripe & PayPal** — Payments
- **Google Cloud Storage / Cloudflare R2** — File storage
- **RudderStack** — Analytics
- **Google Tag Manager** — Tracking

### Environment Configuration
`app/utils/get_env_source.ts` provides isomorphic env access — reads `process.env` on server and `window.ENV` on client. The root loader serializes env vars to `window.ENV`.

### Server-only Files
Files suffixed `.server.ts` are server-only (Remix convention). Key ones:
- `app/db.server.ts`, `app/redis.server.ts`
- `app/services/stripe.server.ts`, `app/services/daily_session.server.ts`
- `app/api/categories.server.ts`

### Mocking
MSW (Mock Service Worker) in `mocks/index.js` — used in dev mode via `binode --require ./mocks`.

### Testing Setup
- **Vitest** with happy-dom environment, setup in `test/setup-test-env.ts`
- **Cypress** for E2E tests in `cypress/`
- Test files co-located (e.g., `app/utils.test.ts`, `app/api/api.test.ts`)

### Shared Types
Core domain types (Product, CartItem, Category, etc.) are in `app/shared/types.ts`. Constants in `app/shared/constants.ts`. Enums in `app/shared/enums.ts`.

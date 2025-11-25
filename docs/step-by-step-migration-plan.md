# Step-by-Step Gradual Migration Plan
# Remix v1.16.0 → React Router 7 + Vercel

**Project**: PeasyDeal Web
**Strategy**: Gradual Migration (Low Risk)
**Timeline**: 3-4 weeks
**Date**: 2025-11-05

---

## Migration Strategy Overview

### Gradual Migration Approach

```
Week 1: Setup & Core Migration (Staging)
├── Day 1-2: Environment setup
├── Day 3-4: Core framework migration
└── Day 5-7: Internal testing

Week 2: Infrastructure Migration (Staging)
├── Day 8-9: Database migration
├── Day 10-11: Redis & image processing
└── Day 12-14: Integration testing

Week 3: Production Deployment & Traffic Shift
├── Day 15-16: Deploy to Vercel production (0% traffic)
├── Day 17: 10% traffic to Vercel
├── Day 18: 25% traffic to Vercel
├── Day 19: 50% traffic to Vercel
├── Day 20: 75% traffic to Vercel
└── Day 21: 100% traffic to Vercel

Week 4: Monitoring & Cleanup
├── Day 22-28: Monitor, optimize, keep VPS as backup
└── Day 28+: Decommission VPS
```

**Key Principle**: At any point, we can roll back traffic to the old VPS with minimal disruption.

---

## Pre-Migration Preparation (Day -7 to Day 0)

### ☐ Week Before Migration Starts

#### Business Preparation
- [ ] **Get stakeholder approval** for migration
  - Present feasibility assessment document
  - Get budget approval (~$70/month for Vercel services)
  - Schedule team kickoff meeting

- [ ] **Schedule migration timeline**
  - Block team calendars for migration weeks
  - Avoid major holidays or sale events
  - Plan for low-traffic deployment windows

- [ ] **Set up communication channels**
  - Create Slack/Teams channel: `#migration-react-router-7`
  - Set up status page (if customer-facing)
  - Prepare email templates for team updates

#### Technical Preparation
- [ ] **Create Vercel account**
  - Sign up at https://vercel.com
  - Upgrade to Pro plan ($20/month)
  - Add team members

- [ ] **Choose service providers**
  - **Database**: ☐ Vercel Postgres OR ☐ Supabase
  - **Redis**: ☐ Vercel KV (recommended)
  - **Images**: ☐ Cloudinary OR ☐ imgix

- [ ] **Set up accounts for chosen services**
  - Create accounts and configure
  - Note API keys and credentials

- [ ] **Document current system**
  - [ ] Take screenshots of production site
  - [ ] Document all critical user flows
  - [ ] Export current performance metrics (Lighthouse scores)
  - [ ] List all environment variables
  - [ ] Document deployment process

- [ ] **Backup everything**
  - [ ] Full SQLite database backup:
    ```bash
    cp prisma/data.db prisma/data.db.backup-$(date +%Y%m%d)
    ```
  - [ ] Export Redis data (if contains critical data):
    ```bash
    redis-cli --rdb dump.rdb
    ```
  - [ ] Backup .env file:
    ```bash
    cp .env .env.backup
    ```
  - [ ] Git commit all current work:
    ```bash
    git add .
    git commit -m "Pre-migration checkpoint"
    git tag pre-migration-$(date +%Y%m%d)
    ```

- [ ] **Test rollback procedures**
  - [ ] Verify VPS restart process works
  - [ ] Test database restore from backup
  - [ ] Document DNS rollback steps
  - [ ] Verify old deployment still works

---

## Week 1: Setup & Core Migration (Staging)

### Day 1: Environment Setup

#### Morning: Create Migration Branch & Vercel Project

**Step 1.1: Create migration branch**
```bash
# Ensure clean working directory
git status

# Create migration branch from current staging/main
git checkout staging  # or main
git pull origin staging
git checkout -b migration/react-router-7

# Push to remote
git push -u origin migration/react-router-7
```

**Step 1.2: Install Vercel CLI and setup project**
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login
# Follow prompts to authenticate

# Initialize Vercel project (from project root)
vercel

# Answer prompts:
# ? Set up and deploy "~/peasydeal_web"? [Y/n] Y
# ? Which scope? [Select your account]
# ? Link to existing project? [N/y] N
# ? What's your project's name? peasydeal-web
# ? In which directory is your code located? ./
# ? Want to override the settings? [y/N] N

# This creates .vercel directory with project config
```

**Step 1.3: Set up database**

**Option A: Vercel Postgres**
```bash
# Via Vercel dashboard:
# 1. Go to https://vercel.com/dashboard
# 2. Select your project
# 3. Go to Storage tab
# 4. Create → Postgres → Create Database
# 5. Name: peasydeal-db
# 6. Region: Choose closest to users (e.g., sin1 for Singapore)

# Pull environment variables
vercel env pull .env.local

# This downloads DATABASE_URL and other Vercel-managed vars
```

**Option B: Supabase**
```bash
# 1. Go to https://supabase.com
# 2. Create new project: peasydeal-web
# 3. Choose region closest to users
# 4. Wait for provisioning (~2 minutes)
# 5. Go to Project Settings → Database
# 6. Copy connection string (pooler mode)

# Add to .env.local manually:
# DATABASE_URL="postgresql://postgres:[password]@[host]:6543/postgres?pgbouncer=true"
```

**Step 1.4: Set up Vercel KV (Redis)**
```bash
# Via Vercel dashboard:
# 1. Go to your project
# 2. Go to Storage tab
# 3. Create → KV (Redis) → Create Database
# 4. Name: peasydeal-kv
# 5. Choose Durable plan ($20/month)

# Pull updated environment variables
vercel env pull .env.local

# This adds KV_REST_API_URL and KV_REST_API_TOKEN
```

**Step 1.5: Set up image CDN**

**Option A: Cloudinary (Recommended)**
```bash
# 1. Go to https://cloudinary.com
# 2. Sign up for free account
# 3. Note your Cloud Name, API Key, API Secret
# 4. Add to .env.local:
# CLOUDINARY_CLOUD_NAME=your-cloud-name
# CLOUDINARY_API_KEY=your-api-key
# CLOUDINARY_API_SECRET=your-api-secret
```

**Checkpoint**: ✓ Vercel project created, services provisioned

---

#### Afternoon: Update Dependencies

**Step 1.6: Backup package.json**
```bash
cp package.json package.json.backup
```

**Step 1.7: Remove old Remix dependencies**
```bash
npm uninstall \
  @remix-run/node \
  @remix-run/react \
  @remix-run/serve \
  @remix-run/dev \
  @remix-run/eslint-config \
  @remix-run/router \
  @remix-run/server-runtime \
  remix-image \
  remix-image-sharp \
  remix-utils
```

**Step 1.8: Install React Router 7 dependencies**
```bash
# Core React Router 7 packages
npm install \
  react-router@^7.8.1 \
  react-router-dom@^7.8.1 \
  @react-router/node@^7.8.1 \
  @react-router/fs-routes@^7.8.1

# Vercel integration
npm install \
  @vercel/react-router@^1.2.2 \
  @vercel/analytics@^1.5.0

# Install as dev dependencies
npm install -D \
  @react-router/dev@^7.8.1 \
  vite@^7.1.3 \
  vite-tsconfig-paths@^4.2.1

# Vercel services
npm install \
  @vercel/kv \
  @vercel/postgres

# Image CDN (if using Cloudinary)
npm install cloudinary
```

**Step 1.9: Update or keep existing dependencies**
```bash
# Keep these (no changes):
# - react, react-dom (already ^18.2.0)
# - @prisma/client
# - All payment libraries (stripe, @paypal/react-paypal-js)
# - All UI libraries (@mui/material, @emotion/react, etc.)
# - All other integrations (algoliasearch, contentful, etc.)
```

**Step 1.10: Verify installation**
```bash
npm install  # Ensure everything installs cleanly
```

**Checkpoint**: ✓ Dependencies updated, no installation errors

---

### Day 2: Configuration Files

#### Morning: Create Configuration Files

**Step 2.1: Create `vite.config.ts`**
```bash
touch vite.config.ts
```

```typescript
// vite.config.ts
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),
  ],
  build: {
    sourcemap: false
  },
  css: {
    devSourcemap: false
  },
  server: {
    port: 5173,  // Vite default port
  },
  // Handle MUI/Emotion if needed
  optimizeDeps: {
    include: [
      '@emotion/react',
      '@emotion/styled',
      '@mui/material',
    ],
  },
});
```

**Step 2.2: Create `react-router.config.ts`**
```bash
touch react-router.config.ts
```

```typescript
// react-router.config.ts
import { vercelPreset } from '@vercel/react-router/vite';
import type { Config } from '@react-router/dev/config';

export default {
  ssr: true,
  presets: [vercelPreset()],
  // Keep your serverBundleWhitelist if needed
  serverDependenciesToBundle: [
    'yet-another-react-lightbox',
    'yet-another-react-lightbox/plugins/thumbnails'
  ],
} satisfies Config;
```

**Step 2.3: Create `app/routes.ts`**
```bash
touch app/routes.ts
```

```typescript
// app/routes.ts
import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

// Use Remix-style file-based routing
export default flatRoutes({
  // Optionally configure route conventions
  ignoredRouteFiles: [
    "**/data/*.*",
    "**/.*",
    "**/*.css",
    "**/*.scss",
    "**/*.test.{js,jsx,ts,tsx}",
    "**/*.map",
    "**/styles/.*",
    "**/stub.*",
    "**/api/*.*",
    "**/api.*",
    "**/images/*.*",
    "**/assets/*.*"
  ],
}) satisfies RouteConfig;
```

**Step 2.4: Create `vercel.json`**
```bash
touch vercel.json
```

```json
{
  "regions": ["sin1"],
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": null,
  "outputDirectory": "build/client"
}
```

**Step 2.5: Update `tsconfig.json`**
```bash
# Backup first
cp tsconfig.json tsconfig.json.backup
```

Update `tsconfig.json`:
```json
{
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".react-router/types/**/*"
  ],
  "compilerOptions": {
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "types": ["@react-router/node", "node", "vite/client"],
    "isolatedModules": true,
    "esModuleInterop": true,
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "target": "ES2022",
    "strict": true,
    "allowJs": true,
    "allowImportingTsExtensions": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "rootDirs": [".", "./.react-router/types"],
    "paths": {
      "~/*": ["./app/*"]
    },
    "noEmit": true
  }
}
```

**Step 2.6: Update `package.json` scripts**
```json
{
  "scripts": {
    "build": "react-router build",
    "dev": "react-router dev",
    "start": "react-router-serve ./build/server/index.js",
    "typecheck": "react-router typegen && tsc",
    "test": "vitest",
    "test:e2e:dev": "start-server-and-test dev http://localhost:5173 \"npx cypress open\"",
    "lint": "eslint --cache --cache-location ./node_modules/.cache/eslint ."
  }
}
```

**Step 2.7: Update `.gitignore`**
```bash
# Add to .gitignore
echo "" >> .gitignore
echo "# React Router 7" >> .gitignore
echo ".react-router/" >> .gitignore
echo "/build" >> .gitignore
echo ".vercel" >> .gitignore
echo ".env.local" >> .gitignore
```

**Checkpoint**: ✓ All configuration files created

---

#### Afternoon: Database Migration Preparation

**Step 2.8: Update Prisma schema**
```bash
# Backup first
cp prisma/schema.prisma prisma/schema.prisma.backup
```

Update `prisma/schema.prisma`:
```prisma
datasource db {
  // Change from sqlite to postgresql
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Keep your existing models
model User {
  id    String @id @default(cuid())
  email String @unique

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  password Password?
  notes    Note[]
}

model Password {
  hash String

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  userId String @unique
}

model Note {
  id    String @id @default(cuid())
  title String
  body  String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)
  userId String
}
```

**Step 2.9: Create PostgreSQL migration**
```bash
# Generate Prisma client for PostgreSQL
npx prisma generate

# Create initial migration (don't run yet)
npx prisma migrate dev --name init_postgres --create-only

# This creates migration file in prisma/migrations/
# Review the generated SQL before applying
```

**Step 2.10: Export data from SQLite**
```bash
# Create a backup SQL dump
sqlite3 prisma/data.db .dump > prisma/sqlite_backup.sql

# Or use Prisma Studio to view data
npx prisma studio
# Manually note down important records
```

**Checkpoint**: ✓ Prisma schema updated, ready for PostgreSQL

---

### Day 3-4: Core Framework Migration

#### Day 3 Morning: Update Server Files

**Step 3.1: Update `app/db.server.ts`**
```typescript
// app/db.server.ts
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare global {
  var __db__: PrismaClient;
}

// Serverless-optimized connection
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient();
  }
  prisma = global.__db__;
  prisma.$connect();
}

// Important: Disconnect on serverless function timeout
// Vercel serverless functions need proper cleanup
export { prisma };
```

**Step 3.2: Update `app/redis.server.ts` → `app/kv.server.ts`**
```bash
# Rename file
mv app/redis.server.ts app/kv.server.ts
```

```typescript
// app/kv.server.ts
import { kv } from '@vercel/kv';

// Vercel KV is already configured via environment variables
// KV_REST_API_URL and KV_REST_API_TOKEN

// Export for use in routes
export { kv };

// Helper functions to maintain compatibility
export const kvHelpers = {
  async get<T>(key: string): Promise<T | null> {
    return await kv.get<T>(key);
  },

  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (ttl) {
      await kv.set(key, value, { ex: ttl });
    } else {
      await kv.set(key, value);
    }
  },

  async del(key: string): Promise<void> {
    await kv.del(key);
  },

  async exists(key: string): Promise<boolean> {
    return (await kv.exists(key)) === 1;
  },
};
```

**Step 3.3: Update `app/session.server.ts`**
```typescript
// app/session.server.ts
import { createCookieSessionStorage, redirect } from "react-router"; // ← Changed import
import invariant from "tiny-invariant";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_SESSION_KEY = "userId";

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function createUserSession({
  request,
  userId,
  remember,
  redirectTo,
}: {
  request: Request;
  userId: string;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
```

**Step 3.4: Update all other `.server.ts` files**
```bash
# Find all .server.ts files
find app -name "*.server.ts" -type f

# For each file, update imports:
# @remix-run/node → react-router
```

Example for `app/api/categories.server.ts`:
```typescript
// Before
import { json } from "@remix-run/node";

// After
import { data } from "react-router";
// Or just return plain objects (auto-serialized)
```

**Checkpoint**: ✓ All server files updated

---

#### Day 3 Afternoon: Update Root and Entry Files

**Step 3.5: Update `app/root.tsx`**
```typescript
// app/root.tsx
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "react-router";
import type { Route } from './+types/root';
import { Analytics } from "@vercel/analytics/react";

// Import your stylesheets
import tailwindStyles from "~/styles/tailwind.css?url";

// Root loader - runs on every request
export async function loader(args: Route.LoaderArgs) {
  const ENV = {
    // Only expose PUBLIC environment variables
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY,
    GOOGLE_TAG_ID: process.env.GOOGLE_TAG_ID,
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    RUDDER_STACK_KEY: process.env.RUDDER_STACK_KEY,
    RUDDER_STACK_URL: process.env.RUDDER_STACK_URL,
  };

  return { ENV };
}

// Define links for <head>
export function links() {
  return [
    { rel: "stylesheet", href: tailwindStyles },
    // Add your other stylesheets
  ];
}

// Layout component wraps your entire app
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}

// Main app component
export default function App() {
  return <Outlet />;
}

// Error boundary for the entire app
export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="error-page">
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  }

  return (
    <div className="error-page">
      <h1>Error</h1>
      <p>{error instanceof Error ? error.message : "Unknown error"}</p>
    </div>
  );
}
```

**Step 3.6: Update `app/entry.server.tsx` (Complex - MUI/Emotion)**

This is complex due to MUI/Emotion SSR. Here's the React Router 7 version:

```typescript
// app/entry.server.tsx
import { renderToString } from "react-dom/server";
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { ServerRouter } from "react-router";
import type { EntryContext } from "react-router";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import { ServerStyleContext } from './context';
import createEmotionCache from "./createEmotionCache";
import theme from './theme';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  entryContext: EntryContext
) {
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  // First render to extract critical CSS
  const html = renderToString(
    <ServerStyleContext.Provider value={null}>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ServerRouter
            context={entryContext}
            url={request.url}
          />
        </ThemeProvider>
      </CacheProvider>
    </ServerStyleContext.Provider>,
  );

  // Extract the CSS from emotion
  const { styles } = extractCriticalToChunks(html);

  // Second render with styles
  let markup = renderToString(
    <ServerStyleContext.Provider value={styles}>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ServerRouter
            context={entryContext}
            url={request.url}
          />
        </ThemeProvider>
      </CacheProvider>
    </ServerStyleContext.Provider>,
  );

  // Inject emotion styles
  let stylesHTML = '';
  styles.forEach(({ key, ids, css }) => {
    const emotionKey = `${key} ${ids.join(' ')}`;
    const newStyleTag = `<style data-emotion="${emotionKey}">${css}</style>`;
    stylesHTML = `${stylesHTML}${newStyleTag}`;
  });

  markup = markup.replace(
    /<meta(\s)*name="emotion-insertion-point"(\s)*content="emotion-insertion-point"(\s)*\/>/,
    `<meta name="emotion-insertion-point" content="emotion-insertion-point"/>${stylesHTML}`,
  );

  responseHeaders.set("Content-Type", "text/html");

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
```

**Step 3.7: Update `app/entry.client.tsx`**
```typescript
// app/entry.client.tsx
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});
```

**Checkpoint**: ✓ Root and entry files updated

---

#### Day 4: Automated Import Updates

**Step 4.1: Create import replacement script**

Create `scripts/update-imports.sh`:
```bash
#!/bin/bash

echo "🔄 Updating imports from Remix to React Router 7..."

# Update @remix-run/node imports
find app -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' \
  's/@remix-run\/node/react-router/g' {} +

# Update @remix-run/react imports
find app -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' \
  's/@remix-run\/react/react-router/g' {} +

# Update @remix-run/server-runtime imports
find app -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' \
  's/@remix-run\/server-runtime/react-router/g' {} +

echo "✅ Import statements updated!"
echo "⚠️  Please review the changes before committing."
```

Make it executable and run:
```bash
chmod +x scripts/update-imports.sh
./scripts/update-imports.sh
```

**Step 4.2: Manual type updates**

Now update type imports that need special handling. Create `scripts/update-types.md` with this checklist:

Search and replace these patterns:

```typescript
// Pattern 1: LoaderFunctionArgs → Route.LoaderArgs
// Find in each route file:
import type { LoaderFunctionArgs } from "@remix-run/node";
export async function loader({ params }: LoaderFunctionArgs) {

// Replace with:
import type { Route } from "./+types/filename";
export async function loader({ params }: Route.LoaderArgs) {

// Pattern 2: ActionFunctionArgs → Route.ActionArgs
import type { ActionFunctionArgs } from "@remix-run/node";
export async function action({ request }: ActionFunctionArgs) {

// Replace with:
import type { Route } from "./+types/filename";
export async function action({ request }: Route.ActionArgs) {

// Pattern 3: Remove json() wrapper
// Find:
return json({ data: something });

// Replace with:
return { data: something };

// Pattern 4: Update error responses
// Find:
throw new Response("Not Found", { status: 404 });

// Replace with:
import { data } from "react-router";
throw data("Not Found", { status: 404 });
```

**Step 4.3: Update one route file as example**

Let's update `app/routes/__index.tsx` as a reference:

```typescript
// app/routes/__index.tsx
import { useState } from 'react';
import type { LinksFunction } from "react-router"; // ← Updated
import {
  Outlet,
  useLoaderData,
  useOutletContext,
} from "react-router"; // ← Updated
import type { Route } from "./+types/__index"; // ← Added
import httpStatus from 'http-status-codes';

import SearchBar from '~/components/SearchBar';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';
import MobileSearchDialog from '~/components/MobileSearchDialog';
import type { Category } from '~/shared/types';
import Footer, { links as FooterLinks } from '~/components/Footer';
import Header, { links as HeaderLinks } from '~/routes/components/Header';
import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';

type LoaderType = {
  categories: Category[];
  navBarCategories: Category[];
};

export const links: LinksFunction = () => {
  return [
    ...FooterLinks(),
    ...HeaderLinks(),
    ...CategoriesNavLinks(),
    ...DropDownSearchBarLinks(),
  ];
};

type ContextType = {
  categories: Category[],
  navBarCategories: Category[]
};

// ✅ Updated loader signature
export async function loader({ request }: Route.LoaderArgs) {
  try {
    const [navBarCategories, categories] = await fetchCategoriesWithSplitAndHotDealInPlaced();

    // ✅ Removed json() wrapper - plain object is auto-serialized
    return {
      categories,
      navBarCategories,
    };
  } catch (err) {
    console.error('Failed to fetch categories:', err);

    // ✅ Updated error response
    throw new Response('Failed to load categories', {
      status: httpStatus.INTERNAL_SERVER_ERROR
    });
  }
}

export default function Index() {
  const { categories, navBarCategories } = useLoaderData<typeof loader>();
  const [isSearchDialogOpen, setSearchDialogOpen] = useState(false);

  return (
    <div className="index-layout">
      <Header onSearchClick={() => setSearchDialogOpen(true)} />

      <CategoriesNav categories={navBarCategories} />

      <main>
        <Outlet context={{ categories, navBarCategories }} />
      </main>

      <Footer categories={categories} />

      <MobileSearchDialog
        open={isSearchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
      />
    </div>
  );
}

export function useIndexData() {
  return useOutletContext<ContextType>();
}
```

**Step 4.4: Generate React Router types**
```bash
# This generates the +types/ directory with type definitions
npm run typecheck

# You should see .react-router/types/ directory created
# Each route gets a corresponding type file
```

**Step 4.5: Commit progress**
```bash
git add .
git commit -m "chore: update core framework imports and types"
```

**Checkpoint**: ✓ Core framework migration complete

---

### Day 5-7: Testing & Debugging (Staging)

#### Day 5: Local Development Testing

**Step 5.1: Try to build**
```bash
npm run build
```

**Expected issues and fixes**:

1. **Build errors about missing types**
   ```bash
   # Run type generation first
   npm run typecheck
   ```

2. **Module resolution errors**
   - Check `vite.config.ts` has `tsconfigPaths()` plugin
   - Check `tsconfig.json` has correct paths

3. **Emotion/MUI errors**
   - Verify `entry.server.tsx` is correct
   - Check theme imports

**Step 5.2: Start development server**
```bash
npm run dev

# Should start on http://localhost:5173
```

**Step 5.3: Test critical routes**

Create testing checklist `docs/testing-checklist.md`:

```markdown
## Route Testing Checklist

### Homepage
- [ ] / - Homepage loads
- [ ] Categories displayed
- [ ] Search bar works
- [ ] Featured products visible

### Product Pages
- [ ] /product/[id] - Product detail page loads
- [ ] Images display correctly
- [ ] Add to cart button works
- [ ] Reviews section visible

### Cart Flow
- [ ] /cart - Cart page loads
- [ ] Items display correctly
- [ ] Quantity updates work
- [ ] Remove item works
- [ ] Promo code field visible

### Checkout Flow
- [ ] /checkout - Checkout page loads
- [ ] Forms render correctly
- [ ] Validation works
- [ ] Payment options visible

### Static Pages
- [ ] /about-us
- [ ] /privacy
- [ ] /terms-of-use
- [ ] /shipping-policy
- [ ] /return-policy

### Blog
- [ ] /blog - Blog list page
- [ ] /blog/post/[slug] - Blog post page

### Error Pages
- [ ] 404 - Not found page
- [ ] Error boundary catches errors
```

**Step 5.4: Fix issues as they arise**

Common issues:

**Issue 1: useLoaderData type errors**
```typescript
// Before (Remix)
const data = useLoaderData<typeof loader>();

// After (React Router 7) - still works!
const data = useLoaderData<typeof loader>();
```

**Issue 2: Form submissions not working**
```typescript
// Ensure actions are updated:
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  // ... handle form
  return { success: true }; // No json() needed
}
```

**Issue 3: Missing environment variables**
```bash
# Copy .env to .env.local
cp .env .env.local

# Or pull from Vercel
vercel env pull .env.local
```

**Checkpoint**: ✓ App builds and runs locally

---

#### Day 6-7: Deep Testing

**Step 6.1: Test all loaders**
```bash
# Go through each route and verify data loads
# Check browser console for errors
# Check network tab for failed requests
```

**Step 6.2: Test all actions (forms)**
```bash
# Test every form in the application:
# - Newsletter subscription
# - Contact forms
# - Checkout forms
# - Review forms
# - Any other form submissions
```

**Step 6.3: Test third-party integrations**

Update your `.env.local` with test credentials:
```bash
# Use Stripe test mode
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_PRIVATE_KEY=sk_test_...

# Use PayPal sandbox
PAYPAL_CLIENT_ID=sandbox_client_id
```

Test:
- [ ] Algolia search works
- [ ] Contentful CMS content loads
- [ ] Google Maps (if used)
- [ ] Stripe payment flow (test mode)
- [ ] PayPal payment flow (sandbox)
- [ ] RudderStack analytics (test mode)

**Step 6.4: Performance testing**
```bash
# Build production bundle
npm run build

# Check bundle sizes
ls -lh build/client/assets/

# Run Lighthouse audit
# Chrome DevTools → Lighthouse tab → Analyze page load
```

**Step 6.5: Commit all fixes**
```bash
git add .
git commit -m "fix: resolve routing and integration issues"
git push origin migration/react-router-7
```

**Checkpoint**: ✓ All routes tested locally, major issues fixed

---

## Week 2: Infrastructure Migration (Staging)

### Day 8-9: Database Migration

#### Day 8 Morning: Apply Database Migration

**Step 8.1: Apply Prisma migration to PostgreSQL**
```bash
# Ensure DATABASE_URL points to PostgreSQL
echo $DATABASE_URL  # Should be postgres://...

# Apply migration
npx prisma migrate deploy

# Verify tables created
npx prisma studio
# Check that tables exist
```

**Step 8.2: Migrate data from SQLite to PostgreSQL**

**Option A: Manual (small dataset)**
```bash
# Export from SQLite
npx prisma db execute --file=prisma/export.sql --url="file:./prisma/data.db"

# Convert to PostgreSQL format (if needed)
# Import to PostgreSQL
# Can use Prisma Studio to manually copy important records
```

**Option B: Script (larger dataset)**

Create `scripts/migrate-data.ts`:
```typescript
// scripts/migrate-data.ts
import { PrismaClient } from '@prisma/client';

// SQLite connection
const sqlitePrisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./prisma/data.db',
    },
  },
});

// PostgreSQL connection
const postgresPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function migrateData() {
  console.log('🔄 Starting data migration...');

  try {
    // Migrate Users
    const users = await sqlitePrisma.user.findMany({
      include: {
        password: true,
        notes: true,
      },
    });

    console.log(`Found ${users.length} users to migrate`);

    for (const user of users) {
      await postgresPrisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          password: user.password ? {
            create: {
              hash: user.password.hash,
            },
          } : undefined,
          notes: {
            create: user.notes.map(note => ({
              id: note.id,
              title: note.title,
              body: note.body,
              createdAt: note.createdAt,
              updatedAt: note.updatedAt,
            })),
          },
        },
      });
    }

    console.log('✅ Data migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await sqlitePrisma.$disconnect();
    await postgresPrisma.$disconnect();
  }
}

migrateData();
```

Run migration:
```bash
tsx scripts/migrate-data.ts
```

**Step 8.3: Verify data migration**
```bash
# Open Prisma Studio
npx prisma studio

# Verify:
# - User count matches
# - Relationships intact
# - Data looks correct
```

**Step 8.4: Test application with PostgreSQL**
```bash
# Start dev server
npm run dev

# Test:
# - User login (if applicable)
# - Any feature that reads from database
# - Any feature that writes to database
```

**Checkpoint**: ✓ Database migrated to PostgreSQL

---

#### Day 9: Update Session Storage (if using Redis sessions)

**Step 9.1: Check if using Redis for sessions**
```bash
# Search for redis session usage
grep -r "remix-redis-session" app/
```

**If using remix-redis-session**:

**Option A: Switch to cookie sessions (simplest)**
Already done! `app/session.server.ts` uses cookie sessions.

**Option B: Keep Redis sessions with Vercel KV**

Update session storage to use Vercel KV:
```typescript
// app/sessions/create_redis_session.ts
import { createCookieSessionStorage } from "react-router";
import { kv } from '@vercel/kv';

// Implement custom session storage with Vercel KV
export const createKVSessionStorage = () => {
  return createCookieSessionStorage({
    cookie: {
      name: "__session",
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secrets: [process.env.SESSION_SECRET!],
      secure: process.env.NODE_ENV === "production",
    },
    async createData(data, expires) {
      const id = crypto.randomUUID();
      const ttl = expires ? Math.floor((expires.getTime() - Date.now()) / 1000) : 86400;
      await kv.set(`session:${id}`, JSON.stringify(data), { ex: ttl });
      return id;
    },
    async readData(id) {
      const data = await kv.get<string>(`session:${id}`);
      return data ? JSON.parse(data) : null;
    },
    async updateData(id, data, expires) {
      const ttl = expires ? Math.floor((expires.getTime() - Date.now()) / 1000) : 86400;
      await kv.set(`session:${id}`, JSON.stringify(data), { ex: ttl });
    },
    async deleteData(id) {
      await kv.del(`session:${id}`);
    },
  });
};
```

**Step 9.2: Update caching code to use Vercel KV**

Find all Redis usage:
```bash
grep -r "ioredis" app/
```

Update to use Vercel KV:
```typescript
// Before
import { ioredis } from '~/redis.server';
await ioredis.set('key', 'value');
const value = await ioredis.get('key');

// After
import { kv } from '@vercel/kv';
await kv.set('key', 'value');
const value = await kv.get<string>('key');
```

**Step 9.3: Test caching**
```bash
# Start dev server
npm run dev

# Test features that use caching:
# - Category caching
# - Product list caching
# - Session data
```

**Checkpoint**: ✓ Caching migrated to Vercel KV

---

### Day 10-11: Image Processing Migration

#### Day 10: Set up Cloudinary

**Step 10.1: Upload existing images to Cloudinary**

Create upload script `scripts/upload-images-to-cloudinary.ts`:
```typescript
// scripts/upload-images-to-cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImages() {
  const imagesDir = path.join(__dirname, '../public/images');
  const files = fs.readdirSync(imagesDir);

  for (const file of files) {
    if (!file.match(/\.(jpg|jpeg|png|gif|webp)$/i)) continue;

    const filePath = path.join(imagesDir, file);

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'peasydeal',
        public_id: path.parse(file).name,
      });

      console.log(`✅ Uploaded: ${file} → ${result.secure_url}`);
    } catch (error) {
      console.error(`❌ Failed to upload ${file}:`, error);
    }
  }
}

uploadImages();
```

Run:
```bash
tsx scripts/upload-images-to-cloudinary.ts
```

**Step 10.2: Create image helper**
```typescript
// app/lib/cloudinary.ts
export function getCloudinaryUrl(
  publicId: string,
  transformations?: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale';
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  }
) {
  const baseUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;

  const transforms = [];
  if (transformations?.width) transforms.push(`w_${transformations.width}`);
  if (transformations?.height) transforms.push(`h_${transformations.height}`);
  if (transformations?.crop) transforms.push(`c_${transformations.crop}`);
  if (transformations?.quality) transforms.push(`q_${transformations.quality}`);
  if (transformations?.format) transforms.push(`f_${transformations.format}`);

  const transformString = transforms.length > 0 ? `${transforms.join(',')}/` : '';

  return `${baseUrl}/${transformString}${publicId}`;
}
```

**Step 10.3: Remove remix-image dependency**
```bash
npm uninstall remix-image remix-image-sharp
```

**Step 10.4: Update image routes**

Remove or update these files:
```bash
# These can be deleted
rm app/routes/__index/remix-image/index.tsx
rm app/routes/__index/remix-image/gcs.ts
rm app/routes/__index/remix-image/r2.ts
```

**Checkpoint**: ✓ Images migrated to Cloudinary

---

#### Day 11: Update Image References

**Step 11.1: Find all image references**
```bash
grep -r "remix-image" app/
grep -r "<Image " app/
```

**Step 11.2: Replace image components**
```typescript
// Before (remix-image)
import { Image } from "remix-image";

<Image
  src={productImage}
  responsive={[
    {
      size: { width: 400, height: 400 },
    },
  ]}
/>

// After (Cloudinary)
import { getCloudinaryUrl } from "~/lib/cloudinary";

<img
  src={getCloudinaryUrl('products/product-123', {
    width: 400,
    height: 400,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  })}
  alt="Product"
  loading="lazy"
/>
```

**Step 11.3: Update all product images**

Create a mapping of old image URLs to Cloudinary public IDs:
```typescript
// app/lib/image-mapping.ts
export const imageMapping: Record<string, string> = {
  '/images/product1.jpg': 'peasydeal/product1',
  '/images/product2.jpg': 'peasydeal/product2',
  // ... add all mappings
};

export function getProductImage(oldUrl: string) {
  const publicId = imageMapping[oldUrl];
  if (!publicId) return oldUrl; // Fallback to old URL

  return getCloudinaryUrl(publicId, {
    width: 800,
    quality: 'auto',
    format: 'auto',
  });
}
```

**Step 11.4: Test images**
```bash
# Start dev server
npm run dev

# Visit pages with images:
# - Homepage
# - Product pages
# - Category pages
# - Blog posts
```

**Checkpoint**: ✓ All images working with Cloudinary

---

### Day 12-14: Integration & End-to-End Testing

#### Day 12: Integration Testing

**Step 12.1: Test database operations**
```bash
# Create test script
# Test CRUD operations
# Verify data persistence
```

**Step 12.2: Test caching**
```bash
# Verify Vercel KV is working
# Test cache hits and misses
# Check TTL behavior
```

**Step 12.3: Test file uploads (if any)**
```bash
# Test any file upload features
# Verify files upload to GCS/R2
```

**Checkpoint**: ✓ All infrastructure components working

---

#### Day 13-14: End-to-End Testing

**Step 13.1: Run Cypress tests**
```bash
# Update Cypress base URL to localhost:5173
# Run E2E tests
npm run test:e2e:dev
```

**Step 13.2: Manual testing of critical flows**

Test complete user journeys:
1. **Purchase Flow**:
   - Browse products
   - Add to cart
   - Apply promo code
   - Checkout
   - Complete payment (test mode)
   - Verify order confirmation

2. **Search Flow**:
   - Use search bar
   - Filter results
   - View product details

3. **Content Flow**:
   - Read blog posts
   - View static pages
   - Subscribe to newsletter

**Step 13.3: Cross-browser testing**
- Chrome
- Firefox
- Safari
- Mobile browsers

**Step 13.4: Accessibility testing**
```bash
# Run Lighthouse accessibility audit
# Check keyboard navigation
# Test screen reader compatibility
```

**Step 13.5: Performance testing**
```bash
npm run build
# Run Lighthouse performance audit
# Target: 90+ performance score
```

**Checkpoint**: ✓ All tests passing, ready for production deployment

---

## Week 3: Production Deployment & Traffic Shift

### Day 15-16: Deploy to Vercel Production

#### Day 15 Morning: Pre-deployment Checklist

**Step 15.1: Final code review**
```bash
# Review all changes
git diff staging...migration/react-router-7

# Run all checks
npm run typecheck
npm run lint
npm run test
npm run build
```

**Step 15.2: Update environment variables in Vercel**

Go to Vercel Dashboard → Project → Settings → Environment Variables

Add all production variables:
```
DATABASE_URL=postgresql://... (production)
SESSION_SECRET=...
STRIPE_PRIVATE_KEY=sk_live_... (LIVE MODE!)
STRIPE_PUBLIC_KEY=pk_live_... (LIVE MODE!)
PAYPAL_CLIENT_ID=... (PRODUCTION!)
GOOGLE_MAP_API_KEY=...
GOOGLE_TAG_ID=...
CONTENTFUL_SPACE_ID=...
CONTENTFUL_ACCESS_TOKEN=...
ALGOLIA_APP_ID=...
ALGOLIA_APP_WRITE_KEY=...
RUDDER_STACK_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
... (all other production variables)
```

⚠️ **CRITICAL**: Ensure payment keys are LIVE mode for production!

**Step 15.3: Create pull request**
```bash
git push origin migration/react-router-7

# Create PR: migration/react-router-7 → staging
# Get team review
# Merge when approved
```

**Checkpoint**: ✓ Code reviewed and merged

---

#### Day 15 Afternoon: Initial Vercel Production Deployment

**Step 15.4: Deploy to Vercel production (0% traffic)**
```bash
# From staging branch
git checkout staging
git pull origin staging

# Deploy to Vercel production
vercel --prod

# Vercel assigns a production URL:
# https://peasydeal-web.vercel.app
# or your custom domain
```

**Step 15.5: Smoke test production deployment**

Visit production URL and test:
- [ ] Homepage loads
- [ ] Can browse products
- [ ] Can add to cart
- [ ] Can view checkout page (don't complete payment yet)
- [ ] Search works
- [ ] Blog pages load
- [ ] All static pages load

**Step 15.6: Set up custom domain (if needed)**
```bash
# In Vercel Dashboard:
# 1. Go to Project → Settings → Domains
# 2. Add domain: www.peasydeal.com
# 3. Get DNS configuration

# Update DNS records (don't switch traffic yet):
# Type: CNAME
# Name: staging
# Value: cname.vercel-dns.com

# This creates: staging.peasydeal.com → Vercel
```

**Checkpoint**: ✓ Production deployment live (but not receiving traffic)

---

#### Day 16: Monitoring Setup

**Step 16.1: Set up Vercel Analytics**

Already included via `<Analytics />` in `app/root.tsx`!

Check dashboard:
- Go to Vercel Dashboard → Project → Analytics
- Verify events are being tracked

**Step 16.2: Set up error monitoring**

Optional but recommended - install Sentry:
```bash
npm install @sentry/react-router
```

Configure in `app/root.tsx`:
```typescript
import * as Sentry from "@sentry/react-router";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
```

**Step 16.3: Set up alerts**

In Vercel Dashboard → Project → Settings → Alerts:
- [ ] Enable deployment failure alerts
- [ ] Enable error rate alerts (>1%)
- [ ] Enable performance alerts (p95 > 1s)

**Step 16.4: Create monitoring dashboard**

Document monitoring URLs:
```markdown
## Monitoring URLs

- Vercel Dashboard: https://vercel.com/your-team/peasydeal-web
- Analytics: https://vercel.com/your-team/peasydeal-web/analytics
- Logs: https://vercel.com/your-team/peasydeal-web/logs
- Sentry: https://sentry.io/organizations/your-org/projects/peasydeal-web/
```

**Checkpoint**: ✓ Monitoring configured

---

### Day 17-21: Gradual Traffic Shift

#### Traffic Shift Strategy

Use DNS-based traffic routing with weighted records or a load balancer.

**Setup Options**:

**Option A: Cloudflare Load Balancer (Recommended)**
1. Set up Cloudflare in front of your domain
2. Create load balancer with two origins:
   - Old VPS: 100% weight initially
   - New Vercel: 0% weight initially
3. Gradually shift weights

**Option B: DNS Round Robin**
1. Create multiple A/CNAME records
2. Gradually remove old and add new

**Option C: Application-level (if you control routing)**
1. Use feature flags in your app
2. Route percentage of requests to new URL

For this guide, we'll use **Option A (Cloudflare)**.

---

#### Day 17: 10% Traffic to Vercel

**Step 17.1: Configure Cloudflare Load Balancer**

1. Go to Cloudflare Dashboard → Traffic → Load Balancing
2. Create Pool "Old VPS":
   - Origin: your-vps-ip:port
   - Weight: 90
3. Create Pool "New Vercel":
   - Origin: peasydeal-web.vercel.app
   - Weight: 10
4. Create Load Balancer:
   - Hostname: www.peasydeal.com
   - Add both pools
5. Save and activate

**Step 17.2: Monitor for 24 hours**

Watch these metrics:
```bash
# Vercel Metrics (New)
- Request count
- Error rate (should be <0.1%)
- p95 response time (should be <500ms)
- Success rate (should be >99%)

# Old VPS Metrics
- Request count (should be 90% of total)
- Compare error rates
- Compare response times
```

**Step 17.3: Check for issues**
```bash
# In Vercel Dashboard → Logs
# Look for:
- 500 errors
- Database connection errors
- Payment errors
- Third-party API errors
```

**Step 17.4: User feedback**
```bash
# Monitor support channels
# Watch for customer complaints
# Check social media
```

**Decision Point**:
- ✅ If metrics look good → Proceed to Day 18
- ❌ If issues found → Roll back to 0% and investigate

**Checkpoint**: ✓ 10% traffic running smoothly

---

#### Day 18: 25% Traffic to Vercel

**Step 18.1: Increase traffic**
```bash
# Update Cloudflare Load Balancer weights:
# Old VPS: 75%
# New Vercel: 25%
```

**Step 18.2: Monitor for 24 hours**

Compare metrics:
```markdown
## Metrics Comparison

| Metric | Old VPS (75%) | New Vercel (25%) | Status |
|--------|---------------|------------------|--------|
| Error Rate | 0.05% | 0.03% | ✅ Better |
| p95 Latency | 800ms | 300ms | ✅ Better |
| Success Rate | 99.95% | 99.97% | ✅ Better |
| Payment Success | 98.5% | 98.7% | ✅ Same/Better |
```

**Step 18.3: Test payment transactions**
```bash
# Monitor actual transactions:
# - Check Stripe dashboard for test/live payments
# - Check PayPal dashboard
# - Verify order confirmations being sent
```

**Checkpoint**: ✓ 25% traffic running smoothly

---

#### Day 19: 50% Traffic to Vercel

**Step 19.1: Increase to 50%**
```bash
# Update Cloudflare Load Balancer weights:
# Old VPS: 50%
# New Vercel: 50%
```

**Step 19.2: Monitor for 24 hours**

This is the critical 50/50 test - any issues will be obvious now.

**Step 19.3: Compare A/B metrics**
```bash
# With equal traffic, directly compare:
# - Conversion rates
# - Bounce rates
# - Average order value
# - Cart abandonment
```

**Step 19.4: Load testing**
```bash
# Optional: Run load test to verify scaling
# Use tools like k6 or Artillery
```

**Checkpoint**: ✓ 50% traffic running smoothly, metrics equal or better

---

#### Day 20: 75% Traffic to Vercel

**Step 20.1: Increase to 75%**
```bash
# Update Cloudflare Load Balancer weights:
# Old VPS: 25%
# New Vercel: 75%
```

**Step 20.2: Monitor for 24 hours**

**Step 20.3: Prepare for full cutover**
```bash
# Verify:
# - All metrics stable
# - No customer complaints
# - Team confident in new system
# - Rollback plan still ready
```

**Checkpoint**: ✓ 75% traffic running smoothly, ready for 100%

---

#### Day 21: 100% Traffic to Vercel 🎉

**Step 21.1: Final cutover**
```bash
# Update Cloudflare Load Balancer weights:
# Old VPS: 0%
# New Vercel: 100%

# Or update DNS directly:
# CNAME www → cname.vercel-dns.com
```

**Step 21.2: Monitor intensively for 24-48 hours**
```bash
# Watch for any issues
# Have team on standby
# Monitor all metrics closely
```

**Step 21.3: Verify complete cutover**
```bash
# Check Old VPS logs - should show no traffic
# Check Vercel logs - should show all traffic
# Verify domain resolves to Vercel
```

**Step 21.4: Celebrate! 🎉**
```bash
# Migration complete!
# Team celebration
# Update stakeholders
```

**Checkpoint**: ✓ 100% traffic on Vercel, migration complete!

---

## Week 4: Monitoring & Cleanup

### Day 22-28: Post-Migration Monitoring

#### Day 22-23: Intensive Monitoring

**Monitor these metrics daily**:
```markdown
## Daily Metrics Dashboard

### Performance
- [ ] p50 response time: <200ms
- [ ] p95 response time: <500ms
- [ ] p99 response time: <1s

### Reliability
- [ ] Uptime: >99.9%
- [ ] Error rate: <0.1%
- [ ] Success rate: >99.9%

### Business
- [ ] Conversion rate: Maintained or improved
- [ ] Order volume: Normal
- [ ] Customer complaints: <5

### Technical
- [ ] Database connections: Stable
- [ ] Cache hit rate: >80%
- [ ] Payment success rate: >98%
```

#### Day 24-25: Optimize Based on Real Data

**Performance optimizations**:
```bash
# If bundle size is large:
# - Implement code splitting
# - Lazy load heavy components
# - Optimize images further

# If database is slow:
# - Add indexes
# - Optimize queries
# - Increase connection pool

# If cold starts are noticeable:
# - Consider Vercel Functions warm-up
# - Optimize function size
```

#### Day 26-27: Documentation Update

**Update all documentation**:
- [ ] README.md - new setup instructions
- [ ] Deployment guide
- [ ] Environment variables guide
- [ ] Monitoring guide
- [ ] Troubleshooting guide
- [ ] Team runbook

#### Day 28: Keep VPS as Backup

**Don't decommission yet**:
```bash
# Keep old VPS running for 1 more week as backup
# In case we need to roll back
# Continue monitoring new system
```

**Checkpoint**: ✓ Week of successful monitoring complete

---

### Day 28+: Final Cleanup

#### After 1 Week of Stable Operation

**Step: Final VPS decommission**
```bash
# Verify Vercel has been stable for 1 week:
# - No major issues
# - Metrics stable
# - Team confident
# - No need to roll back

# Final backup from VPS:
# 1. Export any remaining data
# 2. Save configuration files
# 3. Document anything important

# Decommission old VPS:
# 1. Stop services
# 2. Create final snapshot
# 3. Terminate server
# 4. Cancel hosting
```

**Step: Update DNS (if still pointing to load balancer)**
```bash
# Remove load balancer
# Point DNS directly to Vercel
# CNAME www → cname.vercel-dns.com
```

**Step: Remove temporary infrastructure**
```bash
# Remove migration branch (if fully merged)
git branch -d migration/react-router-7
git push origin --delete migration/react-router-7

# Clean up old docker configs (already done)
# Archive migration documentation
```

**Step: Post-mortem meeting**
```markdown
## Migration Post-Mortem

### What Went Well
- [List successes]

### What Could Be Improved
- [List challenges]

### Lessons Learned
- [List lessons]

### Metrics Comparison
- Performance: Before vs After
- Costs: Before vs After
- Developer velocity: Before vs After
```

**Checkpoint**: ✓ Migration fully complete, old infrastructure decommissioned

---

## Rollback Procedures

### When to Roll Back

**Immediate Rollback (Critical Issues)**:
- Payment processing failures >5%
- Database corruption
- Complete site outage >5 minutes
- Security breach

**Gradual Rollback (Non-Critical)**:
- Error rate 1-5% (reduce traffic %)
- Performance degradation <50%
- Individual feature failures

### How to Roll Back

#### During Traffic Shift (Day 17-21)

**Quick Rollback**:
```bash
# Option A: Cloudflare Load Balancer
# 1. Go to Cloudflare Dashboard
# 2. Update weights:
#    Old VPS: 100%
#    New Vercel: 0%
# Takes effect immediately

# Option B: DNS (slower)
# 1. Update DNS records back to old VPS IP
# 2. Wait for DNS propagation (5-60 minutes)

# Verify old VPS is receiving traffic
# Monitor for stability
```

**Time to Rollback**: 1-5 minutes (load balancer) or 5-60 minutes (DNS)

#### After Full Cutover (Day 22+)

If old VPS is still running:
```bash
# Same process as above
# Update load balancer or DNS
# Point traffic back to old VPS
```

If old VPS is decommissioned:
```bash
# More complex:
# 1. Restore VPS from snapshot
# 2. Start services
# 3. Restore database from backup (if needed)
# 4. Update DNS
# 5. Monitor for stability
```

**Time to Rollback**: 30-90 minutes

---

## Success Criteria

### Technical Success Criteria

- [ ] All 111 routes working correctly
- [ ] Lighthouse Performance score >90
- [ ] Lighthouse Accessibility score >90
- [ ] Lighthouse SEO score >90
- [ ] Error rate <0.1%
- [ ] Uptime >99.9%
- [ ] p95 response time <500ms
- [ ] Payment success rate >98%

### Business Success Criteria

- [ ] Conversion rate maintained or improved
- [ ] No increase in cart abandonment
- [ ] No increase in customer complaints
- [ ] Order volume maintained or improved
- [ ] Page load time <3s

### Operational Success Criteria

- [ ] Deployment time <5 minutes
- [ ] Zero-downtime deployments
- [ ] Monitoring dashboards in place
- [ ] Team trained on new system
- [ ] Documentation complete
- [ ] Runbooks updated

---

## Communication Plan

### Internal Communication

**Daily Standups (During Migration)**:
```markdown
## Daily Migration Standup

**What was completed yesterday:**
- [List]

**What's planned for today:**
- [List]

**Blockers:**
- [List]

**Risks:**
- [List]
```

**Weekly Status Reports**:
```markdown
## Week X Migration Status

**Progress:**
- [X] Completed
- [ ] In Progress
- [ ] Not Started

**Metrics:**
- Build: ✅ Passing
- Tests: ✅ Passing
- Deployment: ✅ Successful

**Next Week:**
- [Plan]
```

### External Communication

**For Users (If Needed)**:

**1 Week Before Traffic Shift:**
```
Subject: Upcoming Platform Upgrade

We're excited to announce upcoming improvements to PeasyDeal!

What's Changing:
- Faster page loads
- Improved reliability
- Better mobile experience

When: [Date Range]
Expected Impact: Minimal to none
We'll keep you updated!
```

**During Migration (If Issues):**
```
Subject: Brief Service Update

We're currently performing a scheduled upgrade.
You may experience:
- Slightly slower load times
- Brief interruptions

We expect everything to be back to normal within [timeframe].
Thank you for your patience!
```

**After Successful Migration:**
```
Subject: Platform Upgrade Complete!

We've successfully upgraded PeasyDeal!

You should notice:
✅ Faster page loads
✅ Improved reliability
✅ Better mobile experience

Thank you for your patience during the upgrade!
```

---

## Team Responsibilities

### Migration Lead
- Overall coordination
- Daily standups
- Risk management
- Stakeholder updates
- Go/no-go decisions

### Backend Developer
- Database migration
- API updates
- Server code migration
- Performance optimization
- Database monitoring

### Frontend Developer
- UI component updates
- Client-side testing
- Image migration
- Accessibility verification
- User experience validation

### DevOps Engineer
- Vercel configuration
- Environment setup
- DNS management
- Monitoring setup
- Traffic routing

### QA Engineer
- Test plan execution
- E2E testing
- Payment flow validation
- Regression testing
- User acceptance testing

---

## Appendix

### Useful Commands Reference

```bash
# Development
npm run dev                    # Start dev server (port 5173)
npm run build                  # Build for production
npm run typecheck              # Run TypeScript checks
npm run lint                   # Run ESLint

# Vercel
vercel                        # Deploy preview
vercel --prod                 # Deploy production
vercel env pull .env.local    # Pull env vars
vercel logs                   # View logs

# Database
npx prisma generate           # Generate client
npx prisma migrate dev        # Run migrations (dev)
npx prisma migrate deploy     # Run migrations (prod)
npx prisma studio            # Open Prisma Studio

# Testing
npm run test                  # Run unit tests
npm run test:e2e:dev         # Run E2E tests

# Git
git checkout -b migration/react-router-7  # Create branch
git add .
git commit -m "message"
git push origin migration/react-router-7
```

### Environment Variables Checklist

```bash
# Core
DATABASE_URL=                 # PostgreSQL connection
SESSION_SECRET=               # Session encryption key
NODE_ENV=                     # production/development

# Vercel Services
KV_REST_API_URL=             # Vercel KV (auto-set)
KV_REST_API_TOKEN=           # Vercel KV (auto-set)

# Payments
STRIPE_PUBLIC_KEY=           # Stripe publishable key
STRIPE_PRIVATE_KEY=          # Stripe secret key
PAYPAL_CLIENT_ID=            # PayPal client ID
STRIPE_CURRENCY_CODE=        # USD, EUR, etc.
PAYPAL_CURRENCY_CODE=        # USD, EUR, etc.

# APIs
GOOGLE_MAP_API_KEY=          # Google Maps
GOOGLE_TAG_ID=               # Google Analytics
ALGOLIA_APP_ID=              # Algolia search
ALGOLIA_APP_WRITE_KEY=       # Algolia admin
ALGOLIA_INDEX_NAME=          # Algolia index
CONTENTFUL_SPACE_ID=         # Contentful CMS
CONTENTFUL_ACCESS_TOKEN=     # Contentful API
RUDDER_STACK_KEY=            # RudderStack analytics
RUDDER_STACK_URL=            # RudderStack endpoint

# Images
CLOUDINARY_CLOUD_NAME=       # Cloudinary account
CLOUDINARY_API_KEY=          # Cloudinary key
CLOUDINARY_API_SECRET=       # Cloudinary secret

# Storage (if keeping GCS)
GCS_PROJECT_ID=              # Google Cloud project
GCS_CLIENT_EMAIL=            # Service account email
GCS_PRIVATE_KEY=             # Service account key
GCS_BUCKET_NAME=             # GCS bucket name

# Backend APIs
PEASY_DEAL_ENDPOINT=         # Your backend API
MYFB_ENDPOINT=               # Your other API
```

### Troubleshooting Guide

**Issue: Build fails with module not found**
```bash
# Solution:
npm install
npx prisma generate
npm run typecheck
```

**Issue: Database connection fails**
```bash
# Check DATABASE_URL is set
echo $DATABASE_URL

# Test connection
npx prisma db push
```

**Issue: Images not loading**
```bash
# Check Cloudinary credentials
# Verify image URLs in browser
# Check CORS settings in Cloudinary
```

**Issue: Styles not applying**
```bash
# Verify Tailwind CSS is compiling
# Check vite.config.ts
# Clear browser cache
```

**Issue: Payment fails in production**
```bash
# Verify using LIVE keys (not test)
# Check webhook endpoints
# Verify domain whitelisting
# Check Stripe/PayPal dashboard for errors
```

---

## Document Metadata

**Version**: 1.0
**Created**: 2025-11-05
**Status**: Ready for Execution
**Timeline**: 3-4 weeks
**Strategy**: Gradual Migration

---

**END OF STEP-BY-STEP MIGRATION PLAN**

Good luck with the migration! 🚀

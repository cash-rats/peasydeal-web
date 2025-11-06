# Revised Step-by-Step Migration Plan
# Remix v1.16.0 → React Router 7 + Vercel

**Project**: PeasyDeal Web
**Strategy**: Gradual Migration (Low Risk)
**Timeline**: 2-3 weeks (REVISED - Simplified!)
**Date**: 2025-11-05

---

## 🎯 IMPORTANT REVISIONS

### Key Differences from Original Assessment:

✅ **NO Database Migration Needed**
- Project doesn't use SQLite or Prisma
- All data retrieved from Go backend API
- **Removed**: All Prisma/database migration steps

✅ **Services Confirmed**
- **Redis**: Upstash via **ioredis** (keep ioredis package!)
- **Images**: Cloudflare R2 via **remix-image** (keep remix-image package!)
- **Backend**: Go API (no direct database access)
- **Database**: Supabase (accessed via Go backend only)

✅ **Simplified Architecture**
```
React Router 7 Frontend (Vercel)
    ↓ HTTP API Calls
Go Backend
    ↓ Database Queries
Supabase PostgreSQL

Session: Cookie-based
Cache: Upstash Redis (via ioredis)
Images: Cloudflare R2 (via remix-image + CDN)
```

✅ **Packages to KEEP (Don't Uninstall)**
- **ioredis** - Works with Upstash, just update connection config
- **remix-image** - Custom image optimization, just update imports
- **remix-image-sharp** - Supporting package for remix-image

**Estimated Timeline**: ~~6-10 days~~ → **4-7 days**

---

## Pre-Migration Preparation (Day -7 to Day 0)

### ☐ Completed Items

#### ✅ Business Preparation (DONE)
- [x] Stakeholder approval
- [x] Budget approved
- [x] Team scheduled

#### ✅ Services Set Up (CONFIRMED)
- [x] **Vercel account** - Created
- [x] **Upstash Redis** - Using this for caching
- [x] **Cloudflare R2** - Using this for image storage
- [x] **Go Backend** - All database operations handled here

#### ✅ Documentation (DONE)
- [x] Current system documented
- [x] Test rollback procedures completed

### ☐ Remaining Pre-Migration Tasks

#### Set up Vercel Project
- [ ] Install Vercel CLI globally
- [ ] Create Vercel project
- [ ] Link to Git repository

#### Verify Service Access
- [ ] **Upstash Redis**:
  - [ ] Confirm database created
  - [ ] Get `UPSTASH_REDIS_REST_URL`
  - [ ] Get `UPSTASH_REDIS_REST_TOKEN`

- [ ] **Cloudflare R2**:
  - [ ] Confirm R2 bucket exists and is accessible
  - [ ] Verify images are public/accessible
  - [ ] Get credentials:
    - `R2_ACCOUNT_ID`
    - `R2_ACCESS_KEY_ID`
    - `R2_SECRET_ACCESS_KEY`
    - `R2_BUCKET_NAME`
    - `R2_PUBLIC_URL`

- [ ] **Go Backend**:
  - [ ] Document all API endpoints used by frontend
  - [ ] Verify backend is production-ready
  - [ ] Confirm CORS configured for Vercel domains
  - [ ] Test all critical endpoints

#### Backup Everything
```bash
# Create Git checkpoint
git add .
git commit -m "Pre-migration checkpoint"
git tag pre-migration-$(date +%Y%m%d)
git push --tags

# Backup environment variables
cp .env .env.backup

# Backup package.json
cp package.json package.json.backup
```

---

## Week 1: Core Migration (4-5 days)

### Day 1: Environment Setup & Dependencies

#### Morning: Create Migration Branch & Vercel Project

**Step 1.1: Create migration branch**
```bash
git checkout staging  # or main
git pull origin staging
git checkout -b migration/react-router-7
git push -u origin migration/react-router-7
```

**Step 1.2: Install Vercel CLI and initialize project**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Initialize project
vercel

# Answer prompts:
# ? Set up and deploy? Y
# ? Which scope? [Your account]
# ? Link to existing project? N
# ? Project name? peasydeal-web
# ? In which directory is your code located? ./
# ? Want to override settings? N
```

**Step 1.3: Set up environment variables**

Create `.env.local` with your service credentials:

```bash
# Core
SESSION_SECRET=your-secret-key
NODE_ENV=development

# Go Backend
PEASY_DEAL_ENDPOINT=https://api.peasydeal.com
MYFB_ENDPOINT=https://myfb-api.peasydeal.com

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Cloudflare R2
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-r2-public-url.com

# Payments (test mode for now)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_PRIVATE_KEY=sk_test_...
PAYPAL_CLIENT_ID=sandbox_...

# APIs
GOOGLE_MAP_API_KEY=...
GOOGLE_TAG_ID=...
CONTENTFUL_SPACE_ID=...
CONTENTFUL_ACCESS_TOKEN=...
ALGOLIA_APP_ID=...
ALGOLIA_APP_WRITE_KEY=...
ALGOLIA_INDEX_NAME=...
RUDDER_STACK_KEY=...
RUDDER_STACK_URL=...
```

**Checkpoint**: ✓ Vercel project created, environment variables ready

---

#### Afternoon: Update Dependencies

**Step 1.4: Remove old Remix and unused packages**
```bash
# Remove Remix framework packages only
npm uninstall \
  @remix-run/node \
  @remix-run/react \
  @remix-run/serve \
  @remix-run/dev \
  @remix-run/eslint-config \
  @remix-run/router \
  @remix-run/server-runtime

# Remove Prisma (not used)
npm uninstall prisma @prisma/client

# Remove remix-utils
npm uninstall remix-utils

# ✅ KEEP THESE - Don't uninstall:
# - ioredis (works with Upstash Redis)
# - remix-image (custom image optimization)
# - remix-image-sharp (supporting package)
```

**Step 1.5: Install React Router 7 packages**
```bash
# Core React Router 7
npm install \
  react-router@^7.8.1 \
  react-router-dom@^7.8.1 \
  @react-router/node@^7.8.1 \
  @react-router/fs-routes@^7.8.1

# Vercel integration
npm install \
  @vercel/react-router@^1.2.2 \
  @vercel/analytics@^1.5.0

# Dev dependencies
npm install -D \
  @react-router/dev@^7.8.1 \
  vite@^7.1.3 \
  vite-tsconfig-paths@^4.2.1

# AWS SDK for Cloudflare R2 (S3-compatible)
# Note: You likely already have this
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

**Step 1.6: Verify installation**
```bash
npm install
```

**Checkpoint**: ✓ Dependencies updated successfully

---

### Day 2: Configuration Files & Server Updates

#### Morning: Create Configuration Files

**Step 2.1: Create `vite.config.ts`**
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
    port: 5173,
  },
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
```typescript
// react-router.config.ts
import { vercelPreset } from '@vercel/react-router/vite';
import type { Config } from '@react-router/dev/config';

export default {
  ssr: true,
  presets: [vercelPreset()],
  serverDependenciesToBundle: [
    'yet-another-react-lightbox',
    'yet-another-react-lightbox/plugins/thumbnails'
  ],
} satisfies Config;
```

**Step 2.3: Create `app/routes.ts`**
```typescript
// app/routes.ts
import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default flatRoutes({
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
echo "" >> .gitignore
echo "# React Router 7" >> .gitignore
echo ".react-router/" >> .gitignore
echo "/build" >> .gitignore
echo ".vercel" >> .gitignore
echo ".env.local" >> .gitignore
```

**Checkpoint**: ✓ Configuration files created

---

#### Afternoon: Update Server Files

**Step 2.8: Remove unused files**
```bash
# Remove Prisma files (not used)
rm -rf prisma/
rm -f app/db.server.ts
```

**Step 2.9: Update Redis connection to Upstash**

**KEEP `app/redis.server.ts`** - Just update the connection config!

Update `app/redis.server.ts`:
```typescript
// app/redis.server.ts
import type { RedisOptions, Redis } from 'ioredis';
import IORedis from 'ioredis';

let redis: Redis;

declare global {
  var __redis__: Redis;
}

// Upstash connection options
const options: RedisOptions = {
  host: process.env.REDIS_HOST!,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  // Upstash requires TLS
  tls: process.env.REDIS_TLS_ENABLED === 'true' ? {} : undefined,
  // Serverless optimizations
  maxRetriesPerRequest: 3,
  enableReadyCheck: false,
  enableOfflineQueue: false,
};

// Serverless-optimized pattern (same as before)
if (process.env.NODE_ENV === 'production') {
  redis = new IORedis(options);
} else {
  if (!global.__redis__) {
    global.__redis__ = new IORedis(options);
  }
  redis = global.__redis__;
}

// Export for use (same as before)
export { redis };

// Optional: Export ioredis for backward compatibility
export { IORedis as ioredis };
```

**Update environment variables** in `.env.local`:
```bash
# Upstash Redis (using ioredis client)
REDIS_HOST=your-endpoint.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your-upstash-password
REDIS_TLS_ENABLED=true
```

**Note**: All your existing code using `redis` continues to work unchanged!

**Step 2.10: Update session management**

Update `app/session.server.ts`:
```typescript
// app/session.server.ts
import { createCookieSessionStorage, redirect } from "react-router";
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
        maxAge: remember ? 60 * 60 * 24 * 7 : undefined,
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

**Step 2.11: Update remix-image route for React Router 7**

Update the loader type in `app/routes/__index/remix-image/index.tsx`:

```typescript
// app/routes/__index/remix-image/index.tsx
import type { LoaderFunction } from "react-router"; // ← Changed from @remix-run/server-runtime
import { imageLoader, MemoryCache } from 'remix-image/server';
import type { LoaderConfig } from 'remix-image';
// ... rest stays the same

export const loader: LoaderFunction = async ({ request }) => {
  // ... all your existing logic stays the same
};
```

**Note**: Your custom CDN integration and R2 storage code stays exactly as-is!

**Step 2.12: Update root.tsx for remix-image CSS**

Update the CSS import in `app/root.tsx`:

```typescript
// app/root.tsx
import remixImageStyles from "remix-image/remix-image.css?url"; // ← Add ?url suffix

export function links() {
  return [
    { rel: "stylesheet", href: remixImageStyles },
    // ... other links
  ];
}
```

**Step 2.13: NO changes needed for Redis imports!**

All your existing code importing `redis.server` works as-is:
```typescript
// These continue to work unchanged:
import { redis } from '~/redis.server';
import { ioredis } from '~/redis.server';

await redis.set('key', 'value');
await redis.get('key');
```

Only the **connection configuration** changed to point to Upstash!

**Checkpoint**: ✓ Server files updated

---

### Day 3: Core Framework Migration

#### Update Root and Entry Files

**Step 3.1: Update `app/root.tsx`**
```typescript
// app/root.tsx
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";
import type { Route } from './+types/root';
import { Analytics } from "@vercel/analytics/react";

import tailwindStyles from "~/styles/tailwind.css?url";

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
    R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
  };

  return { ENV };
}

export function links() {
  return [
    { rel: "stylesheet", href: tailwindStyles },
  ];
}

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

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="error-page">
        <h1>{error.status} {error.statusText}</h1>
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

**Step 3.2: Update `app/entry.server.tsx`**
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

  const html = renderToString(
    <ServerStyleContext.Provider value={null}>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ServerRouter context={entryContext} url={request.url} />
        </ThemeProvider>
      </CacheProvider>
    </ServerStyleContext.Provider>,
  );

  const { styles } = extractCriticalToChunks(html);

  let markup = renderToString(
    <ServerStyleContext.Provider value={styles}>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ServerRouter context={entryContext} url={request.url} />
        </ThemeProvider>
      </CacheProvider>
    </ServerStyleContext.Provider>,
  );

  let stylesHTML = '';
  styles.forEach(({ key, ids, css }) => {
    const emotionKey = `${key} ${ids.join(' ')}`;
    stylesHTML += `<style data-emotion="${emotionKey}">${css}</style>`;
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

**Step 3.3: Update `app/entry.client.tsx`**
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

### Day 4: Automated Import Updates

**Step 4.1: Create import update script**

Create `scripts/update-imports.sh`:
```bash
#!/bin/bash

echo "🔄 Updating imports from Remix to React Router 7..."

# Update @remix-run imports
find app -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' \
  's/@remix-run\/node/react-router/g' {} +

find app -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' \
  's/@remix-run\/react/react-router/g' {} +

find app -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' \
  's/@remix-run\/server-runtime/react-router/g' {} +

# Note: We're NOT updating redis imports - they stay as-is!
# The redis.server.ts file keeps its name and exports

echo "✅ Imports updated!"
echo "⚠️  Review changes before committing"
echo ""
echo "📝 Note: remix-image and ioredis imports are unchanged"
```

Run the script:
```bash
chmod +x scripts/update-imports.sh
./scripts/update-imports.sh
```

**Step 4.2: Manual route file updates**

Update each route file to use new types. Example `app/routes/__index.tsx`:
```typescript
// app/routes/__index.tsx
import { useState } from 'react';
import type { LinksFunction } from "react-router";
import { Outlet, useLoaderData, useOutletContext } from "react-router";
import type { Route } from "./+types/__index";
import httpStatus from 'http-status-codes';

import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';
// ... other imports

export const links: LinksFunction = () => {
  return [
    // ... your links
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const [navBarCategories, categories] =
      await fetchCategoriesWithSplitAndHotDealInPlaced();

    // Plain object return (no json() wrapper needed)
    return {
      categories,
      navBarCategories,
    };
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    throw new Response('Failed to load categories', {
      status: httpStatus.INTERNAL_SERVER_ERROR
    });
  }
}

export default function Index() {
  const { categories, navBarCategories } = useLoaderData<typeof loader>();

  // ... component code
}
```

**Step 4.3: Generate types**
```bash
npm run typecheck
```

This creates `.react-router/types/` directory with auto-generated types.

**Step 4.4: Commit progress**
```bash
git add .
git commit -m "chore: migrate to React Router 7"
git push origin migration/react-router-7
```

**Checkpoint**: ✓ Core migration complete

---

### Day 5: Testing & Debugging

**Step 5.1: Build the project**
```bash
npm run build
```

Fix any build errors that appear.

**Step 5.2: Start development server**
```bash
npm run dev
```

Visit `http://localhost:5173`

**Step 5.3: Test critical functionality**

- [ ] Homepage loads
- [ ] Products load from Go backend
- [ ] Cart operations work
- [ ] Checkout flow works
- [ ] Images load from Cloudflare R2
- [ ] Cache works (Upstash Redis)
- [ ] Search works (Algolia)
- [ ] Blog posts load (Contentful)

**Step 5.4: Test Go backend integration**

Open browser console and verify:
- API calls to `PEASY_DEAL_ENDPOINT` working
- No CORS errors
- Data loading correctly

If CORS errors appear, update Go backend to allow:
- `http://localhost:5173` (development)
- Your Vercel domains (when deployed)

**Step 5.5: Test Upstash Redis (via ioredis)**

Check Upstash dashboard:
- Go to Upstash console
- View "Data Browser" tab
- Verify keys being created
- Check request count increasing

Verify in application:
- Category caching works
- No Redis connection errors
- TLS connection successful
- Cache operations working

**Step 5.6: Test remix-image + Cloudflare R2**

Verify:
- Product images load
- Check network tab: `/remix-image?src=...&width=...` requests
- Images served as webp
- CDN fallback working
- No 403/404 errors

**Checkpoint**: ✓ App running locally, all integrations working

---

## Week 2: Production Deployment & Traffic Shift

### Day 6: Production Deployment (0% Traffic)

**Step 6.1: Set environment variables in Vercel**

Go to Vercel Dashboard → Project → Settings → Environment Variables

Add ALL production variables (from `.env.local` but with production values):

**⚠️ CRITICAL**: Use LIVE payment credentials for production!

**Step 6.2: Deploy to Vercel**
```bash
git checkout staging
git merge migration/react-router-7
git push origin staging

vercel --prod
```

**Step 6.3: Smoke test production**

Visit production URL and test:
- [ ] Homepage loads
- [ ] Products load
- [ ] Images from R2 load
- [ ] Go backend API calls work
- [ ] No CORS errors

**Update Go backend CORS** if needed to allow:
- `https://peasydeal-web.vercel.app`
- Your custom domain

**Checkpoint**: ✓ Production deployed (0% traffic)

---

### Day 7-12: Gradual Traffic Shift

Use Cloudflare Load Balancer or similar to route traffic:

- **Day 7**: 10% to Vercel
- **Day 8**: 25% to Vercel
- **Day 9**: 50% to Vercel
- **Day 10**: 75% to Vercel
- **Day 11**: 100% to Vercel 🎉
- **Day 12**: Monitor intensively

Monitor at each step:
- Error rates
- API response times
- Payment success rates
- Customer complaints

**Checkpoint**: ✓ 100% traffic on Vercel

---

## Week 3: Cleanup

### Day 13-14: Monitoring & Optimization

- Monitor metrics daily
- Optimize slow queries
- Update documentation

### Day 15+: Decommission Old VPS

After 1 week of stable operation:
- Final backup
- Decommission old VPS
- Post-mortem meeting

---

## Key Files to Update

### Remove:
- `prisma/` directory
- `app/db.server.ts`
- `remix.config.js`
- `docker-compose.*.yaml`
- `ecosystem.config.js`

### Update:
- `app/redis.server.ts` (connection config only - keep filename!)
- `app/session.server.ts` (imports only)
- `app/root.tsx` (imports + remix-image CSS import)
- `app/entry.server.tsx` (imports only)
- `app/entry.client.tsx` (imports only)
- `app/routes/__index/remix-image/index.tsx` (loader type only)
- All route files (imports only - @remix-run → react-router)
- All API server files (imports only - @remix-run → react-router)

### Create:
- `vite.config.ts`
- `react-router.config.ts`
- `app/routes.ts`
- `vercel.json`

### Keep Unchanged:
- ✅ `ioredis` package and all Redis usage code
- ✅ `remix-image` package and all `<Image>` components
- ✅ All Cloudflare R2 integration code
- ✅ All Go backend API calls

---

## Environment Variables Checklist

```bash
# Core
SESSION_SECRET=
NODE_ENV=

# Go Backend
PEASY_DEAL_ENDPOINT=
MYFB_ENDPOINT=

# Upstash Redis (via ioredis)
REDIS_HOST=your-endpoint.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your-upstash-password
REDIS_TLS_ENABLED=true

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# Payments (LIVE for production!)
STRIPE_PUBLIC_KEY=
STRIPE_PRIVATE_KEY=
STRIPE_PAYMENT_RETURN_URI=
STRIPE_CURRENCY_CODE=
PAYPAL_CLIENT_ID=
PAYPAL_CURRENCY_CODE=

# APIs
GOOGLE_MAP_API_KEY=
GOOGLE_TAG_ID=
GOOGLE_ANALYTICS_ID=
CONTENTFUL_SPACE_ID=
CONTENTFUL_ACCESS_TOKEN=
ALGOLIA_APP_ID=
ALGOLIA_APP_WRITE_KEY=
ALGOLIA_INDEX_NAME=
RUDDER_STACK_KEY=
RUDDER_STACK_URL=
```

---

## Success Criteria

- [ ] All 111 routes working
- [ ] Lighthouse Performance >90
- [ ] Error rate <0.1%
- [ ] p95 response time <500ms
- [ ] Go backend API calls successful
- [ ] Upstash Redis caching working
- [ ] Cloudflare R2 images loading
- [ ] Payment flows working (test & live)
- [ ] Conversion rate maintained

---

## Quick Start Summary

**Week 1** (5 days):
1. Environment setup
2. Update dependencies
3. Create config files
4. Update server files
5. Migrate routes
6. Test locally

**Week 2** (6 days):
7. Deploy to production (0% traffic)
8-12. Gradual traffic shift (10% → 100%)

**Week 3**:
13-14. Monitor and optimize
15+. Decommission old infrastructure

**Total: 2-3 weeks**

---

Good luck with the migration! 🚀

# Migration Guide: Remix (Docker/VPS) → React Router 7 + Vercel

## Overview

This comprehensive guide will help you migrate from a Remix application hosted on VPS with Docker to React Router 7 deployed on Vercel. React Router v7 is the successor to Remix and provides a more streamlined development experience with improved performance and developer ergonomics.

**What You'll Achieve:**
- Modern React Router 7 architecture with auto-generated type safety
- Serverless deployment on Vercel with automatic scaling
- Zero-config deployment with Git integration
- Global CDN for static assets
- Built-in analytics and performance monitoring

---

## Phase 1: Pre-Migration Assessment

### Step 1.1: Analyze Current Project Structure

First, document your current Remix project structure:

```bash
# Document your current structure
ls -la app/
cat package.json
cat remix.config.js  # or remix.config.ts
ls -la app/routes/
```

**Critical Items to Document:**

1. **Routes**: List all files in `app/routes/`
   - Note any nested routing patterns
   - Identify layout routes (parent routes without index)
   - Document dynamic routes (with `$` parameters)

2. **Data Loading**: Identify all:
   - `loader` functions (server-side data fetching)
   - `action` functions (form submissions, mutations)
   - `meta` functions (SEO/metadata)

3. **Server Logic**:
   - Custom server code in `server.ts` or `server.js`
   - Session management implementation
   - Authentication middleware
   - API routes

4. **Environment Variables**: List all variables in `.env`
   - Separate public vs. private variables
   - Note database connection strings
   - API keys and secrets

5. **Dependencies**: Review `package.json` for:
   - Remix-specific packages (will need updates)
   - Server-only packages (ensure Vercel serverless compatibility)
   - Database/ORM packages (check edge/serverless support)

### Step 1.2: Check Dependencies Compatibility

**Potential Issues to Watch For:**

- **WebSocket dependencies**: Vercel doesn't support persistent WebSocket connections
- **File system operations**: Use cloud storage (Vercel Blob, S3, etc.)
- **Long-running processes**: Serverless functions have timeout limits (10s hobby, 60s pro)
- **Database connections**: Need connection pooling for serverless

**Recommended Serverless-Compatible Services:**
- **Database**: Supabase, PlanetScale, Vercel Postgres, Neon
- **File Storage**: Vercel Blob, Cloudflare R2, AWS S3
- **Caching**: Vercel KV (Redis), Upstash
- **Real-time**: Server-Sent Events, Pusher, Ably

---

## Phase 2: Setup New React Router 7 Project

### Step 2.1: Initialize Project Structure

```bash
# IMPORTANT: Create backup of old project first!
cp -r /path/to/old-project /path/to/old-project-backup

# In your project directory, initialize package.json
npm init -y
```

### Step 2.2: Install Core Dependencies

```bash
# Core React and React Router 7 packages
npm install react@^18.3.1 react-dom@^18.2.0
npm install react-router@^7.8.1 react-router-dom@^7.8.1
npm install @react-router/node@^7.8.1
npm install @react-router/fs-routes@^7.8.1

# Vercel integration
npm install @vercel/react-router@^1.2.2
npm install @vercel/analytics@^1.5.0

# Development dependencies
npm install -D @react-router/dev@^7.8.1
npm install -D vite@^7.1.3
npm install -D vite-tsconfig-paths@^4.2.1
npm install -D typescript@^5.1.6
npm install -D @types/react@^18.2.20
npm install -D @types/react-dom@^18.2.7

# If using Tailwind CSS
npm install -D tailwindcss@^4.1.11
npm install -D autoprefixer@^10.4.21
npm install -D @tailwindcss/postcss@^4.1.11

# Common utilities (if needed)
npm install isbot@^5.1.30  # Bot detection
npm install zod@^4.0.2  # Schema validation
```

### Step 2.3: Create Configuration Files

#### Create `vite.config.ts`

```typescript
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
    port: 5173,  // Default Vite port
  }
});
```

#### Create `react-router.config.ts`

```typescript
import { vercelPreset } from '@vercel/react-router/vite';
import type { Config } from '@react-router/dev/config';

export default {
  ssr: true,
  presets: [vercelPreset()],
} satisfies Config;
```

#### Create `app/routes.ts`

```typescript
import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default flatRoutes() satisfies RouteConfig;
```

**Note**: `flatRoutes()` uses file-based routing like Remix. Your route file structure remains the same!

#### Create `tsconfig.json`

```json
{
  "include": ["**/*.ts", "**/*.tsx", ".react-router/types/**/*"],
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
      "~/*": ["./app/*"],
      "@/*": ["./app/*"]
    },
    "noEmit": true
  }
}
```

#### Create `vercel.json`

```json
{
  "regions": ["sin1"]
}
```

**Available Regions:**
- `sin1` - Singapore (Asia)
- `iad1` - Washington D.C. (US East)
- `sfo1` - San Francisco (US West)
- `fra1` - Frankfurt (Europe)

Choose the region closest to your users.

#### Update `package.json`

Add these properties and scripts:

```json
{
  "name": "your-app-name",
  "private": true,
  "sideEffects": false,
  "type": "module",
  "scripts": {
    "build": "react-router build",
    "dev": "react-router dev",
    "typecheck": "react-router typegen && tsc",
    "start": "react-router-serve ./build/server/index.js"
  },
  "engines": {
    "node": ">=22.0.0"
  }
}
```

#### Create `.gitignore`

```
node_modules
.react-router/
/build
.env*
.vercel
.DS_Store
```

#### Create Tailwind Config (if using Tailwind)

**`tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**`postcss.config.js`:**
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

**Create `app/tailwind.css`:**
```css
@import "tailwindcss";
```

---

## Phase 3: Migrate Code

### Step 3.1: Migrate Root Component

Create `app/root.tsx` - this is your application shell:

```typescript
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
import tailwindStyles from "~/tailwind.css?url";

// Root loader - runs on every request
export async function loader(args: Route.LoaderArgs) {
  // Example: Load environment variables for client
  const ENV = {
    // Only expose PUBLIC environment variables
    API_URL: process.env.API_URL,
    PUBLIC_KEY: process.env.PUBLIC_KEY,
  };

  // Example: Get user session
  // const user = await getUserFromSession(args.request);

  return {
    ENV,
    // user,
  };
}

// Define links for <head>
export function links() {
  return [
    { rel: "stylesheet", href: tailwindStyles },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous"
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
    },
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

**Key Points:**
- `loader` runs on server for every request
- `Layout` wraps your entire app (including error boundaries)
- Auto-generated types via `Route.LoaderArgs`
- No need for `json()` - plain objects are auto-serialized

### Step 3.2: Migrate Routes - Import Changes

**Key Import Replacements:**

```typescript
// ❌ OLD (Remix)
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";

// ✅ NEW (React Router 7)
import { data, redirect } from "react-router";
import { useLoaderData, useActionData, Form } from "react-router";
import type { Route } from "./+types/your-route-name";  // Auto-generated!
import type { MetaFunction } from "react-router";
```

### Step 3.3: Migrate Route Files - Detailed Example

**BEFORE (Remix):**

```typescript
// app/routes/blog.$slug.tsx
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data.post.title },
    { name: "description", content: data.post.excerpt },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ post });
}

export default function BlogPost() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

**AFTER (React Router 7):**

```typescript
// app/routes/blog.$slug.tsx
import { data } from "react-router";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/blog.$slug";  // Auto-generated types!
import type { MetaFunction } from "react-router";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data.post.title },
    { name: "description", content: data.post.excerpt },
  ];
};

export async function loader({ params }: Route.LoaderArgs) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    throw data("Not Found", { status: 404 });
  }

  // No json() needed - auto-serialized!
  return { post };
}

export default function BlogPost() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

**Key Changes:**
1. ✅ Import `Route` type from `./+types/blog.$slug`
2. ✅ Use `Route.LoaderArgs` instead of `LoaderFunctionArgs`
3. ✅ Return plain object instead of `json()`
4. ✅ Use `data()` instead of `new Response()` for errors
5. ✅ Everything else stays the same!

### Step 3.4: Migrate Actions (Form Handling)

**BEFORE (Remix):**

```typescript
import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");

  if (!email || typeof email !== "string") {
    return json({ error: "Email is required" }, { status: 400 });
  }

  await subscribeToNewsletter(email);
  return redirect("/thank-you");
}

export default function Subscribe() {
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post">
      <input type="email" name="email" required />
      {actionData?.error && <p>{actionData.error}</p>}
      <button type="submit">Subscribe</button>
    </Form>
  );
}
```

**AFTER (React Router 7):**

```typescript
import { redirect } from "react-router";
import { Form, useActionData } from "react-router";
import type { Route } from "./+types/subscribe";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");

  if (!email || typeof email !== "string") {
    return { error: "Email is required" };  // Auto-serialized with 400 if error
  }

  await subscribeToNewsletter(email);
  return redirect("/thank-you");
}

export default function Subscribe() {
  const actionData = useActionData<typeof action>();

  return (
    <Form method="post">
      <input type="email" name="email" required />
      {actionData?.error && <p>{actionData.error}</p>}
      <button type="submit">Subscribe</button>
    </Form>
  );
}
```

### Step 3.5: Route File Naming (No Changes!)

Your route file structure remains **exactly the same**:

| File Path | URL Route |
|-----------|-----------|
| `app/routes/_index.tsx` | `/` |
| `app/routes/about.tsx` | `/about` |
| `app/routes/blog._index.tsx` | `/blog` |
| `app/routes/blog.$slug.tsx` | `/blog/:slug` |
| `app/routes/dashboard.tsx` | Layout (no route) |
| `app/routes/dashboard._index.tsx` | `/dashboard` |
| `app/routes/dashboard.settings.tsx` | `/dashboard/settings` |
| `app/routes/api.webhook.tsx` | `/api/webhook` |

**Dot notation for nested routes:**
- `dashboard.settings.tsx` → `/dashboard/settings`
- `dashboard.settings.profile.tsx` → `/dashboard/settings/profile`

### Step 3.6: Migrate Server-Only Code

React Router 7 automatically excludes files ending in `.server.ts` from the client bundle.

**Create separate `.server.ts` files:**

```typescript
// app/lib/db.server.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!  // Server-only key
);

export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}
```

```typescript
// app/lib/session.server.ts
import { createCookieSessionStorage } from "react-router";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET!],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getUserFromSession(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const userId = session.get("userId");

  if (!userId) return null;

  return await getUserById(userId);
}
```

**Usage in routes:**

```typescript
// app/routes/dashboard.tsx
import { redirect } from "react-router";
import type { Route } from "./+types/dashboard";
import { getUserFromSession } from "~/lib/session.server";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUserFromSession(request);

  if (!user) {
    throw redirect("/login");
  }

  return { user };
}
```

### Step 3.7: Environment Variables

**Best Practice for Environment Variables:**

1. **Create `.env` file** (never commit):
```bash
# Server-only secrets
DATABASE_URL="postgresql://..."
SESSION_SECRET="your-secret-key"
STRIPE_SECRET_KEY="sk_test_..."

# Public variables (exposed to client)
API_URL="https://api.example.com"
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

2. **Expose public vars in `root.tsx` loader:**

```typescript
// app/root.tsx
export async function loader() {
  return {
    ENV: {
      // Only expose public environment variables
      API_URL: process.env.API_URL,
      STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    }
  };
}
```

3. **Access in client components:**

```typescript
import { useLoaderData } from "react-router";
import type { loader as rootLoader } from "~/root";

export default function Component() {
  const { ENV } = useLoaderData<typeof rootLoader>();

  console.log(ENV.API_URL);  // Available on client

  return <div>...</div>;
}
```

**Alternative: Create typed env helper:**

```typescript
// app/env.ts
const getEnv = () => {
  return {
    API_URL: process.env.API_URL!,
    DATABASE_URL: process.env.DATABASE_URL!,
    // ... other vars
  };
};

export const env = getEnv();
```

---

## Phase 4: Remove Docker/Server Configuration

### Step 4.1: Remove Server Files

Delete these files (Vercel handles deployment):

```bash
rm Dockerfile
rm docker-compose.yml
rm server.ts  # or server.js
rm .dockerignore
```

Delete any:
- Nginx configuration files
- Apache configuration files
- PM2 configuration files
- Custom server middleware files

### Step 4.2: Database Connection Changes

**Issue**: VPS allows persistent database connections. Vercel serverless functions create new connections on each invocation.

**Solution**: Use connection pooling or serverless-optimized databases.

#### Option 1: Supabase (Recommended)

```bash
npm install @supabase/supabase-js
```

```typescript
// app/lib/supabase.server.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);
```

Supabase handles connection pooling automatically.

#### Option 2: PostgreSQL with Connection Pooling

```bash
npm install @vercel/postgres
```

```typescript
// app/lib/db.server.ts
import { sql } from '@vercel/postgres';

export async function getUser(id: string) {
  const result = await sql`SELECT * FROM users WHERE id = ${id}`;
  return result.rows[0];
}
```

#### Option 3: Prisma with Connection Pooling

```typescript
// app/lib/db.server.ts
import { PrismaClient } from '@prisma/client';

// Prevent multiple instances in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

**Update `DATABASE_URL` to use connection pooling:**
```
DATABASE_URL="postgresql://user:pass@host:6543/db?pgbouncer=true"
```

### Step 4.3: File Storage Changes

**Issue**: Serverless functions don't have persistent filesystem.

**Solutions:**

#### Vercel Blob Storage

```bash
npm install @vercel/blob
```

```typescript
// app/lib/storage.server.ts
import { put } from '@vercel/blob';

export async function uploadFile(file: File) {
  const blob = await put(file.name, file, {
    access: 'public',
  });

  return blob.url;
}
```

#### AWS S3

```bash
npm install @aws-sdk/client-s3
```

```typescript
// app/lib/s3.server.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: 'us-east-1' });

export async function uploadToS3(file: Buffer, key: string) {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: file,
  }));
}
```

---

## Phase 5: Vercel Deployment

### Step 5.1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 5.2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 5.3: Initialize Vercel Project

```bash
# Run from your project root
vercel
```

**Answer the prompts:**
- **Set up and deploy?** Yes
- **Which scope?** Select your account/team
- **Link to existing project?** No
- **Project name?** Enter your project name
- **Directory?** `.` (current directory)
- **Override settings?** No (or Yes to customize)

**Build Settings (if asked):**
- **Framework Preset:** Other (or let it auto-detect)
- **Build Command:** `npm run build`
- **Output Directory:** `build/client`
- **Install Command:** `npm install`

This creates a `.vercel` directory with project configuration.

### Step 5.4: Set Environment Variables

**Via CLI:**

```bash
# Production environment
vercel env add API_URL production
vercel env add DATABASE_URL production
vercel env add SESSION_SECRET production

# Preview environment
vercel env add API_URL preview

# Development (local)
vercel env add API_URL development
```

**Via Vercel Dashboard:**

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable with appropriate environments:
   - **Production**: Live environment
   - **Preview**: Pull request deployments
   - **Development**: Local development (pulled with `vercel env pull`)

**Pull environment variables locally:**

```bash
vercel env pull .env.local
```

### Step 5.5: Deploy to Production

```bash
# Deploy to production
vercel --prod
```

Your app is now live! Vercel will provide a URL like:
```
https://your-app-name.vercel.app
```

### Step 5.6: Set Up Git Integration (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to Vercel Dashboard → **Import Project**
3. Select your repository
4. Vercel auto-detects settings

**Now every push to `main` = automatic production deployment!**

**Benefits:**
- Preview deployments for every PR
- Automatic rollbacks
- Deployment comments on commits/PRs

---

## Phase 6: Testing & Validation

### Step 6.1: Test Locally

```bash
# Start development server
npm run dev
```

Visit `http://localhost:5173`

**Test checklist:**
- [ ] All routes load correctly
- [ ] Navigation works
- [ ] Forms submit properly (actions work)
- [ ] Data loads correctly (loaders work)
- [ ] Styles are applied
- [ ] Images load
- [ ] Error boundaries work (visit non-existent route)

### Step 6.2: Test Preview Deployment

```bash
# Deploy preview
vercel
```

Vercel provides a preview URL. Test:
- [ ] All functionality works on preview
- [ ] Environment variables are correct
- [ ] Database connections work
- [ ] File uploads work (if applicable)
- [ ] Authentication works
- [ ] API routes respond correctly

### Step 6.3: Test Production Deployment

After deploying to production (`vercel --prod`):

- [ ] Test all critical user flows
- [ ] Check SEO meta tags (view source)
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit (Chrome DevTools)
- [ ] Check Vercel Analytics (Dashboard → Analytics)
- [ ] Monitor errors (Dashboard → Errors)

### Step 6.4: Performance Validation

**Run Lighthouse:**
1. Open Chrome DevTools
2. Go to **Lighthouse** tab
3. Select **Performance**, **Accessibility**, **SEO**
4. Click **Analyze page load**

**Target Scores:**
- Performance: 90+
- Accessibility: 90+
- SEO: 90+

**Check Bundle Size:**

```bash
npm run build
```

Review output in `build/client/` directory. Look for:
- Large JavaScript bundles (consider code splitting)
- Unoptimized images (use `<img>` with proper sizing)

---

## Phase 7: Domain & DNS

### Step 7.1: Add Custom Domain

**Via Vercel Dashboard:**

1. Go to your project → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `example.com`)
4. Vercel will provide DNS configuration

### Step 7.2: Configure DNS

**For Domain Registrar (GoDaddy, Namecheap, etc.):**

**Option A: Use Vercel Nameservers (Recommended)**

Point your domain's nameservers to Vercel:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Option B: Add DNS Records**

Add these records in your DNS provider:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

**For Subdomain (`app.example.com`):**

| Type | Name | Value |
|------|------|-------|
| CNAME | app | cname.vercel-dns.com |

### Step 7.3: SSL Certificate

Vercel automatically provisions SSL certificates via Let's Encrypt.

**Process:**
1. Add domain in Vercel
2. Configure DNS
3. Wait for DNS propagation (up to 48 hours)
4. Vercel automatically issues SSL certificate
5. Your site is now `https://`

**Check SSL status:** Vercel Dashboard → Domains → Your domain

---

## Common Migration Issues & Solutions

### Issue 1: "Module not found" Errors

**Error:**
```
Cannot find module '~/components/Header'
```

**Solution:**

Ensure `vite-tsconfig-paths` is installed and configured:

```bash
npm install -D vite-tsconfig-paths
```

```typescript
// vite.config.ts
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),  // ← Add this
  ],
});
```

Verify `tsconfig.json` has path aliases:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["./app/*"]
    }
  }
}
```

### Issue 2: Server-Only Code in Client Bundle

**Error:**
```
process is not defined
```

**Cause:** Server-only code (e.g., database queries) is being imported in client code.

**Solution:**

1. **Move to `.server.ts` files:**
   ```
   db.ts → db.server.ts
   ```

2. **Only import in loaders/actions:**
   ```typescript
   // ✅ Good - in loader
   export async function loader() {
     const data = await db.query(...);
     return { data };
   }

   // ❌ Bad - in component
   export default function Component() {
     const data = db.query(...);  // Don't do this!
   }
   ```

### Issue 3: Session/Cookie Issues

**Error:**
Cookies not persisting or session data lost.

**Solution:**

Ensure cookie settings are serverless-compatible:

```typescript
import { createCookieSessionStorage } from "react-router";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRET!],
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
});
```

**Important for Vercel:**
- Always use `httpOnly: true` for security
- Set `secure: true` in production
- Don't rely on in-memory session storage (use cookies or database)

### Issue 4: Database Connection Errors

**Error:**
```
Too many database connections
```

**Cause:** Each serverless function creates new database connection.

**Solutions:**

1. **Use connection pooling** (see Phase 4.2)

2. **Use Prisma with connection limit:**
   ```typescript
   const prisma = new PrismaClient({
     datasources: {
       db: {
         url: process.env.DATABASE_URL,
       },
     },
     log: ['error'],
   });
   ```

3. **Use Supabase** (built-in connection pooling)

4. **Adjust database connection limits** (increase `max_connections`)

### Issue 5: File Upload Failures

**Error:**
```
EROFS: read-only file system
```

**Cause:** Vercel serverless functions have read-only filesystem (except `/tmp`).

**Solution:**

Use cloud storage instead of local filesystem:

```typescript
// ❌ Don't do this
import fs from 'fs';
fs.writeFileSync('./uploads/file.jpg', buffer);

// ✅ Do this instead
import { put } from '@vercel/blob';
const blob = await put('file.jpg', buffer, { access: 'public' });
```

### Issue 6: Environment Variables Not Available

**Error:**
```
undefined when accessing process.env.VARIABLE_NAME
```

**Solutions:**

1. **Add variables in Vercel Dashboard:**
   Settings → Environment Variables

2. **Redeploy after adding variables:**
   ```bash
   vercel --prod
   ```

3. **For local development:**
   ```bash
   vercel env pull .env.local
   ```

4. **Ensure variables are not prefixed** (Vercel doesn't use `VITE_` prefix like Vite)

### Issue 7: Serverless Function Timeout

**Error:**
```
Function execution timeout
```

**Cause:** Serverless functions have timeout limits:
- Hobby: 10 seconds
- Pro: 60 seconds

**Solutions:**

1. **Optimize slow queries:**
   - Add database indexes
   - Reduce data fetching
   - Use pagination

2. **Move long-running tasks to background:**
   - Use Vercel Cron Jobs
   - Use queue services (Inngest, QStash)

3. **Upgrade Vercel plan** (if needed)

### Issue 8: WebSocket Not Supported

**Error:**
WebSocket connections fail on Vercel.

**Solution:**

Use alternatives:

1. **Server-Sent Events (SSE):**
   ```typescript
   // app/routes/api.events.tsx
   export async function loader({ request }: Route.LoaderArgs) {
     const stream = new ReadableStream({
       start(controller) {
         const encoder = new TextEncoder();

         const interval = setInterval(() => {
           controller.enqueue(
             encoder.encode(`data: ${JSON.stringify({ time: Date.now() })}\n\n`)
           );
         }, 1000);

         return () => clearInterval(interval);
       },
     });

     return new Response(stream, {
       headers: {
         'Content-Type': 'text/event-stream',
         'Cache-Control': 'no-cache',
         'Connection': 'keep-alive',
       },
     });
   }
   ```

2. **Third-party services:**
   - Pusher
   - Ably
   - Supabase Realtime

3. **Polling:** Simple but less efficient

---

## Key Differences Summary

| Aspect | Remix (Docker/VPS) | React Router 7 (Vercel) |
|--------|-------------------|-------------------------|
| **Runtime** | Long-running Node.js server | Serverless edge functions |
| **Deployment** | Manual Docker builds & pushes | `git push` auto-deploys |
| **Scaling** | Manual (upgrade VPS) | Automatic & instant |
| **Geographic Distribution** | Single datacenter | Global edge network (CDN) |
| **Static Assets** | Served by Express/nginx | Global CDN (instant worldwide) |
| **Cold Starts** | None (always running) | ~100-300ms (first request) |
| **Environment Variables** | `.env` file on server | Vercel dashboard + CLI |
| **Database Connections** | Persistent connections | Connection pooling required |
| **File Storage** | Local filesystem | Cloud storage (Blob, S3) |
| **WebSockets** | Fully supported | Not supported (use SSE/Pusher) |
| **Costs** | Fixed monthly VPS fee | Pay-per-use (free tier available) |
| **Monitoring** | Self-managed (PM2, etc.) | Built-in analytics & logging |
| **SSL Certificates** | Manual (Let's Encrypt) | Automatic (zero config) |
| **CI/CD** | Self-configured | Built-in GitHub integration |
| **Timeouts** | Unlimited | 10s (hobby), 60s (pro) |
| **DDoS Protection** | Self-managed | Built-in |

---

## Migration Checklist

### Pre-Migration
- [ ] Backed up old project completely
- [ ] Documented all routes and functionality
- [ ] Listed all environment variables
- [ ] Identified serverless-incompatible code
- [ ] Chose database solution (Supabase/Vercel Postgres/etc.)
- [ ] Chose file storage solution (Vercel Blob/S3/etc.)

### Setup
- [ ] Installed all dependencies
- [ ] Created `vite.config.ts`
- [ ] Created `react-router.config.ts`
- [ ] Created `app/routes.ts`
- [ ] Created `tsconfig.json`
- [ ] Created `vercel.json`
- [ ] Updated `package.json` scripts
- [ ] Created `.gitignore`

### Code Migration
- [ ] Migrated `app/root.tsx`
- [ ] Updated all route imports (`@remix-run/*` → `react-router`)
- [ ] Updated all loader type signatures
- [ ] Updated all action type signatures
- [ ] Replaced `json()` with plain object returns
- [ ] Moved server code to `.server.ts` files
- [ ] Updated environment variable handling
- [ ] Migrated session management
- [ ] Updated database connections (added pooling)
- [ ] Updated file storage to cloud

### Cleanup
- [ ] Removed `Dockerfile`
- [ ] Removed `docker-compose.yml`
- [ ] Removed `server.ts`/`server.js`
- [ ] Removed nginx/Apache configs
- [ ] Removed PM2 configs

### Testing
- [ ] Tested locally with `npm run dev`
- [ ] Tested all routes
- [ ] Tested all forms (actions)
- [ ] Tested error boundaries
- [ ] Tested authentication flow
- [ ] Ran TypeScript check: `npm run typecheck`

### Deployment
- [ ] Installed Vercel CLI
- [ ] Logged into Vercel
- [ ] Initialized Vercel project
- [ ] Added all environment variables to Vercel
- [ ] Deployed preview: `vercel`
- [ ] Tested preview deployment thoroughly
- [ ] Deployed production: `vercel --prod`
- [ ] Tested production deployment

### Production Setup
- [ ] Configured custom domain
- [ ] Updated DNS records
- [ ] Verified SSL certificate active
- [ ] Set up GitHub/GitLab integration
- [ ] Configured preview deployments for PRs
- [ ] Set up monitoring/alerts
- [ ] Verified Vercel Analytics working

### Post-Migration
- [ ] Ran Lighthouse audit (scores 90+)
- [ ] Monitored error logs for 24-48 hours
- [ ] Verified database performance
- [ ] Checked bundle sizes
- [ ] Updated documentation
- [ ] Informed team/users of migration

---

## Next Steps After Migration

### 1. Enable Advanced Features

**Vercel Analytics:**
Already included via `@vercel/analytics`. View in Vercel Dashboard.

**Vercel Speed Insights:**
```bash
npm install @vercel/speed-insights
```

```typescript
// app/root.tsx
import { SpeedInsights } from '@vercel/speed-insights/react';

export function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

**Edge Config (Feature Flags):**
```bash
npm install @vercel/edge-config
```

### 2. Set Up CI/CD

**GitHub Actions for Testing:**

`.github/workflows/test.yml`:
```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 22
      - run: npm install
      - run: npm run typecheck
      - run: npm test
```

### 3. Optimize Performance

**Code Splitting:**
Use lazy loading for heavy components:

```typescript
import { lazy } from 'react';

const HeavyChart = lazy(() => import('~/components/HeavyChart'));

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading chart...</div>}>
      <HeavyChart />
    </Suspense>
  );
}
```

**Image Optimization:**
Use Vercel's Image Optimization:

```typescript
// Use next/image equivalent via Vercel
import { getImageProps } from 'react-router';
```

Or use a service like Cloudinary/imgix.

### 4. Monitoring & Observability

**Set Up Error Tracking:**

Install Sentry:
```bash
npm install @sentry/react-router
```

**Set Up Uptime Monitoring:**
- Use Vercel's built-in monitoring
- Or services like UptimeRobot, Pingdom

### 5. Security Hardening

**Add Security Headers:**

```typescript
// app/root.tsx
export function headers() {
  return {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
}
```

**Content Security Policy:**
Configure in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'"
        }
      ]
    }
  ]
}
```

---

## Resources

**Official Documentation:**
- [React Router Docs](https://reactrouter.com)
- [Vercel Docs](https://vercel.com/docs)
- [Vercel + React Router Guide](https://vercel.com/docs/frameworks/react-router)

**Migration Resources:**
- [Remix to React Router Migration Guide](https://reactrouter.com/dev/guides/migrating-from-remix)
- [Vercel Limits](https://vercel.com/docs/limits)

**Community:**
- [React Router Discord](https://rmx.as/discord)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

## Conclusion

Congratulations on migrating to React Router 7 + Vercel! You now have:

✅ **Modern DX**: Type-safe routing, auto-generated types, fast HMR
✅ **Serverless Architecture**: Auto-scaling, global distribution
✅ **Zero-Config Deployment**: `git push` to deploy
✅ **Built-in Analytics**: Performance monitoring out of the box
✅ **Cost Efficiency**: Pay-per-use with generous free tier

**Your app is faster, more reliable, and easier to maintain.**

If you encounter issues not covered in this guide, check the official docs or reach out to the React Router/Vercel communities. Happy shipping! 🚀

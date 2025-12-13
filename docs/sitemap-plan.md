# Sitemap Implementation Plan

This document outlines a practical plan to introduce and maintain XML sitemaps for PeasyDeal’s ecommerce site.

---

## Goals
- Expose all important canonical URLs (home, static pages, categories, promotions, products, blog) to search engines.
- Keep implementation simple and low-overhead by reusing existing SEO utilities and backend APIs.
- Support both staging and production domains without hard-coding hosts.

---

## High-Level Strategy
- Serve a sitemap index at `/sitemap.xml` that links to one or more child sitemaps.
- Store (or generate) child sitemaps under `/sitemaps` so they’re served as static assets.
- Gradually migrate from the current hard-coded staging XML in `public/sitemaps` to generated XML that uses the canonical domain.

Child sitemap breakdown:
- `static_pages.xml` – marketing and legal pages.
- `collection.xml` – category landing pages (`/collection/:slug`).
- `promotions.xml` – promotion landing pages (`/promotion/:slug`).
- `products-*.xml` – product detail URLs, split to respect sitemap limits.
- optionally `blog.xml` – blog index and posts if we want fine-grained control.

---

## Step 1 – Wire Up Basics

1. **Add `robots.txt`**
   - Create `public/robots.txt`.
   - Allow normal crawling and point to the sitemap index, e.g.:
     - `Sitemap: https://www.peasydeal.com/sitemap.xml`
   - Use the canonical domain (`getCanonicalDomain()` in `app/utils/seo.ts`) when configuring host-specific values.

2. **Create a sitemap index route**
   - Add `app/routes/sitemap.xml/route.tsx`.
   - Export a `loader` that:
     - Uses `getCanonicalDomain()` from `app/utils/seo.ts` to generate `<loc>` values.
     - Returns a `Response` with `Content-Type: application/xml`.
     - Emits a minimal `<sitemapindex>` that links to:
       - `/sitemaps/static_pages.xml`
       - `/sitemaps/collection.xml`
       - `/sitemaps/promotions.xml` and any future `products-*.xml`.
   - This route becomes the single entry point for search engines (`/sitemap.xml`).

3. **Clean up existing static XML**
   - Existing XML lives in `public/sitemaps` and currently hard-codes `https://staging.peasydeal.com/...`.
   - For a first pass:
     - Keep only the files we actually want (e.g. `static_pages.xml`, `collection.xml`, possibly a subset of category maps).
     - Update their `<loc>` entries to use the production host (or a neutral host) instead of staging.
   - Long term, these should be replaced by generated files (see below).

---

## Step 2 – Generated Static Sitemaps

Implement a Node-based script (e.g. `scripts/generate-sitemaps.ts`) that runs in the project environment and writes XML into `public/sitemaps`.

1. **Static pages sitemap (`static_pages.xml`)**
   - Define a fixed list of URL paths that should always be indexed:
     - `/`
     - `/about-us`
     - `/contact-us`
     - `/privacy`
     - `/return-policy`
     - `/shipping-policy`
     - `/terms-of-use`
     - `/sell-on-peasydeal`
     - `/blog` (and optionally selected blog pages).
   - For each path:
     - Build the full URL using `getCanonicalDomain()`.
     - Emit `<url>` entries with `changefreq="yearly"` (or `monthly` for blog) and `priority` tuned by importance.
   - Write the resulting XML to `public/sitemaps/static_pages.xml`.

2. **Collection sitemap (`collection.xml`)**
   - Use category APIs already available in `app/api/categories.server.ts`:
     - Prefer `fetchCategoriesRegardlessType` or `fetchTaxonomyCategories` to get a complete list of category slugs.
   - For each category:
     - Build URL `/collection/${category.name}`.
     - Use a reasonable `changefreq` (e.g. `monthly`) and priority (e.g. `0.7`).
   - Write to `public/sitemaps/collection.xml`.

3. **Promotions sitemap (`promotions.xml`)**
   - If promotions are modeled as categories (`type: 'promotion'` in `app/api/categories.server.ts`), reuse the same API:
     - Use `fetchCategoriesFromServer('promotion')` via a thin wrapper.
   - Emit URLs of the form `/promotion/${name}` into `public/sitemaps/promotions.xml`.

4. **Products sitemaps (`products-*.xml`)**
   - Best option is to have a backend endpoint that returns product IDs/slugs and last-modified timestamps specifically for sitemaps (e.g. `/v2/products/sitemap`). If this exists or can be added, consume that.
   - Recommended response shape (snake_case):
     ```json
     {
       "products": [
         {
           "product_uuid": "uuid-123",
           "product_name": "Awesome Widget",     // or provide slug
           "slug": "awesome-widget",             // optional if you already compute it
           "primary_category": "hot_deal",       // optional hint for canonical category
           "updated_at": "2025-01-09T12:00:00Z", // ISO-8601 for <lastmod>
           "is_active": true                     // ensure only indexable items are returned
         }
       ],
       "total": 4519,
       "next_cursor": null                       // string if paginated; omit if returning all at once
     }
     ```
   - Required fields: `product_uuid`, `updated_at`, and either `product_name` or `slug`.
   - Optional: `primary_category`, `is_active`, `slug` (if you don’t provide `product_name`), `next_cursor` (only if you paginate).
   - With this endpoint available, you can skip the category-pagination fallback and just consume this listing.
   - Split into multiple sitemap files only if you later exceed 50k URLs or ~50MB per file (`products-1.xml`, `products-2.xml`, etc.).
   - Add all generated product sitemap filenames to the sitemap index route loader.

5. **Blog sitemap (`blog.xml`, optional)**
   - If blog URLs come from Contentful (see `fetchContentfulPostWithId` in `app/api/products.ts`), either:
     - Ask backend/Contentful for a dedicated “all posts” listing, or
     - Maintain a small manifest of canonical blog slugs (if the blog is small and curated).
   - Emit those URLs into `public/sitemaps/blog.xml` and list it in the sitemap index.

6. **NPM script wiring**
   - Add a script entry in `package.json`, e.g.:
     - `"generate:sitemaps": "tsx scripts/generate-sitemaps.ts"`
   - Integrate into build or deploy pipelines:
     - Run before `npm run build` locally, or
     - Run as part of CI/CD before publishing artifacts.

---

## Step 2b – Dynamic `sitemap.xml` Routes (React Router 7) with Redis-precomputed XML

Precompute full XML in a worker, cache it in Redis, and have loaders stream the cached XML. This keeps request handling O(1) and avoids per-request iteration.

### Flow overview
- **Worker (scheduled, e.g. every 15–60 min):**
  - Calls backend `/v2/products/sitemap` (or other sources for collections/static pages/blog).
  - Builds **final XML strings** (no JSON needed for products).
  - Writes to Redis using atomic swap:
    - Write to `sitemap:products:next`, then `RENAME` to `sitemap:products`.
  - Store meta alongside (e.g., `sitemap:products:meta` with `generated_at`, `count`).

- **Routes (React Router loaders):**
  - `app/routes/sitemap.xml/route.tsx`:
    - Reads a cached sitemap index XML from Redis (or builds from cached child URLs).
    - Returns `Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })`.
  - `app/routes/sitemaps.products.xml/route.tsx`:
    - Reads `sitemap:products` (XML) from Redis.
    - Returns XML with correct content type.
  - Optional similar routes for collections, static pages, blog (either read cached XML or cached JSON and convert).

### Product sitemap worker input (preferred backend API)

Endpoint (snake_case, can return all products at once for 4.5k items):
```json
{
  "products": [
    {
      "product_uuid": "uuid-123",
      "product_name": "Awesome Widget",     // or provide slug
      "slug": "awesome-widget",             // optional if you already compute it
      "primary_category": "hot_deal",       // optional hint for canonical category
      "updated_at": "2025-01-09T12:00:00Z", // ISO-8601 for <lastmod>
      "is_active": true                     // ensure only indexable items are returned
    }
  ],
  "total": 4519,
  "next_cursor": null                       // omit if returning all at once
}
```

Required: `product_uuid`, `updated_at`, and either `product_name` or `slug`. Optional: `primary_category`, `is_active`, `slug`, `next_cursor` (if you decide to paginate later).

### Worker caching details
- Keys: `sitemap:products` (XML or JSON) and `sitemap:products:meta` (e.g., `generated_at`, `count`).
- Atomic swap: write to `...:next`, then rename to avoid serving partial data.
- TTL: optional; rely on scheduled overwrites or set TTL slightly above the interval.
- Failure handling: keep serving the last good cache; alert on generation failures or sudden count drops.

### Route logic (simple, fast)
- Read XML from Redis; if absent, return 503 or a minimal fallback (to avoid empty sitemaps).
- No upstream HTTP calls or iterations on the request path.

### Relationship to static files in `public/sitemaps`

Two approaches:
1) **Hybrid**: keep static XML for static pages/collections, and serve products via Redis-backed routes. `/sitemap.xml` references both static files and dynamic routes.
2) **Fully dynamic**: generate everything via the worker and serve all XML from Redis-backed routes. Keep static files only as a local fallback if desired.

---

## Step 3 – Decide What to Exclude

Explicitly avoid indexing:
- `cart`, `cart._index`
- `checkout`, `checkout._index`
- `payment`, `payment.$orderId`
- `tracking`
- `search`
- Any other session-specific or query-heavy result pages.

These routes should not appear in any sitemap; they are discoverable via navigation but not intended as canonical landing pages.

---

## Step 4 – Validation & Monitoring

1. **Local validation**
   - Run the generator: `npm run generate:sitemaps`.
   - `npm run build` to ensure no TypeScript/runtime errors from shared helpers.
   - Open `http://localhost:5173/sitemap.xml` while running `npm run dev` and verify:
     - Correct host (staging vs production).
     - Linked child sitemaps return valid XML with `<urlset>` or `<sitemapindex>`.

2. **Search Console & robots.txt**
   - Submit `/sitemap.xml` in Google Search Console.
   - Confirm `robots.txt` is accessible and references the correct sitemap URL.

3. **Ongoing maintenance**
 - When adding new important routes (e.g. new static pages or route segments under `app/routes`), update:
   - The static pages list in the generator.
   - Any category/promotion APIs if semantics change.
 - Keep `getCanonicalDomain()` up to date so sitemaps always emit correct hosts for each environment.

---

## TODO Checklist (execution tracking)
- [x] Add `public/robots.txt` with `Sitemap: <canonical-domain>/sitemap.xml`.
- [x] Implement dynamic sitemap index route `app/routes/sitemap.xml/route.tsx` (uses `getCanonicalDomain()`, reads cached XML or builds from cached child URLs).
- [x] Add products sitemap route `app/routes/sitemaps.products.xml/route.tsx`:
  - [x] Read cached XML from Redis key `sitemap:products` (precomputed by worker).
  - [x] Return XML with correct content type; 503 or minimal fallback if missing.
- [x] (Optional) Add collection sitemap route `app/routes/sitemaps.collections.xml/route.tsx` (reads cached XML/JSON, cache in Redis).
- [x] (Optional) Add promotions sitemap route `app/routes/sitemaps.promotions.xml/route.tsx` (reads cached XML/JSON, cache in Redis).
- [x] (Optional) Add static pages sitemap route `app/routes/sitemaps.static-pages.xml/route.tsx` (reads cached XML/JSON, cache optional).
- [x] Update sitemap index loader to include all active child sitemaps (dynamic routes and/or existing `public/sitemaps/*.xml`).
- [x] Worker: schedule job to fetch `/v2/products/sitemap`, build XML (or JSON), and store in Redis via atomic swap (`sitemap:products:next` → `sitemap:products`), plus meta key (`generated_at`, `count`).
- [ ] If keeping/generating static XML files: ensure they use `getCanonicalDomain()` and live under `public/sitemaps`.
- [x] Remove or update legacy `public/sitemaps` files that hard-code `staging` hosts.
- [ ] Validation: load `/sitemap.xml` and child sitemaps locally, confirm correct host + XML shape.
- [ ] Submit `/sitemap.xml` in Google Search Console and verify `robots.txt` reachability.

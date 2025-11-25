# Collection Route Migration Plan

This document outlines how to migrate the legacy Remix-style collection route that currently lives under `__index/collection/$collection.tsx` into the React Router 7 file‑based routing system that powers the rest of the app.

---

## Objectives
- Serve `/collection/:collection` via the new router stack so navigation from the header categories resolves to a first-class route.
- Preserve existing loader/action logic (SEO metadata, canonical redirects, paginated fetching, structured data).
- Consolidate shared chrome (header, nav, footer) into a layout route to avoid duplicative fetches and keep consistency with `cart`, `payment`, etc.
- Delete the remaining dependency on the deprecated `__index` tree so future refactors happen only inside `app/routes`.

---

## Target Route Structure
```
app/routes/
  collection.tsx                 # layout route (loader serves nav data, renders <Header/> + <Outlet/>)
  collection/
    $collection.tsx              # main page component moved from legacy file
    loaders.ts                   # productsLoader + loadmoreProductsLoader
    reducer.ts
    types.ts
    structured_data.ts
```

The layout mirrors `app/routes/cart.tsx` by:
1. Fetching `categories` and `navBarCategories` in its loader via `fetchCategoriesWithSplitAndHotDealInPlaced`.
2. Rendering `Header`, `CategoriesNav`, `MobileSearchDialog`, `Footer`, and an `Outlet` for child routes.
3. Passing shared data to the child via `useLoaderData` (or using `useRouteLoaderData('routes/collection')` if needed).

The `$collection.tsx` child imports its loader/action helpers from sibling files to keep concerns separated.

---

## Detailed Steps

### 1. Move Non-Route Utilities
- Relocate `__index/api/resolve_category_name.server.ts` to `app/api/resolve-category-name.server.ts`.
- Update `app/api/index.ts` to re-export `resolveCategoryName`.
- Move the `fetchProductsByCategoryV2` implementation (and helpers such as `fetchActivityBanners` if still required) from `__index/api/index.tsx` into `app/api/products.server.ts` (or similar). Re-export from `app/api/index.ts`.
- Fix all import sites (`~/api`) so they pull from the new module. This also cleans up TODO comments (e.g., `app/api/index.ts` currently comments out those exports).

### 2. Create `app/routes/collection.tsx` (Layout Route)
- Copy the structural pattern from `app/routes/cart.tsx`:
  - `links` merges Header/Footer/CategoriesNav styles.
  - `loader` fetches nav data and returns it as JSON along with a canonical link.
  - Component renders `Header`, `CategoriesNav`, `MobileSearchDialog`, `DropDownSearchBar`, and `Footer`, wrapping the `Outlet`.
- Expose `categories`/`navBarCategories` via `useLoaderData` for the layout and via `useRouteLoaderData('routes/collection')` for children.

### 3. Move `$collection` Page Into New Route Directory
- Copy the entire contents of `__index/collection/$collection.tsx` into `app/routes/collection/$collection.tsx`.
- Update relative imports:
  - Replace `../components/...` paths with the correct absolute alias (`~/routes/collection/components/...` or `~/components/...`) according to file locations.
  - Point helper imports (`productsLoader`, `loadmoreProductsLoader`, reducer, types, structuredData) to the new siblings under `app/routes/collection/`.
  - Import `resolveCategoryName` from `~/api`.
- Convert `CatchBoundary` into `export function ErrorBoundary()` that renders `<FourOhFour />` when `isRouteErrorResponse`.
- Keep `links`, `meta`, `handle`, loader, and action logic intact so SEO + pagination behavior is unchanged.
- Ensure the load-more fetcher continues to POST to `/collection/${category}?index`.

### 4. Relocate Supporting Modules
- Move these legacy helpers into the new directory without code changes:
  - `__index/collection/loaders.ts` → `app/routes/collection/loaders.ts`
  - `__index/collection/reducer.ts` → `app/routes/collection/reducer.ts`
  - `__index/collection/types.ts` → `app/routes/collection/types.ts`
  - `__index/collection/structured_data.ts` → `app/routes/collection/structured_data.ts`
- Adjust import paths inside the files themselves (e.g., ensure shared imports use the `~/` alias).
- Export anything that needs to be consumed elsewhere (e.g., `structuredData` via `$collection.tsx`’s `handle`).

### 5. Wire Up Navigation Redirects
- Update `app/api/check_is_possible_category.server.ts` to call the new `resolveCategoryName` helper so `/desks` requests can redirect properly.
- Confirm `app/routes/$.tsx` still redirects to `/collection/${categoryName}` for single-segment URLs and now hits the newly migrated route.

### 6. Clean Up Legacy Paths
- Once the new route works, remove the old files under `__index/collection/` (or archive if still needed for reference).
- Delete stale exports/commented code that referenced the `__index` location (e.g., the commented exports in `app/api/index.ts`).

---

## Verification Checklist
1. **Type Safety** – `npm run typecheck` should pass; this validates new module paths.
2. **Linting** – `npm run lint` ensures no import/order regressions.
3. **Runtime Test** – `npm run dev` and visit `/collection/{knownCategory}`:
   - Header + nav render correctly.
   - Loader populates products, breadcrumb, and metadata.
   - “Show More” button triggers the fetcher call to `/collection/${category}?index` and appends products.
4. **Redirects** – Manually hit an old-style `/desks` URL and confirm it 302s to `/collection/desks`.
5. **SEO Tags** – View source to ensure canonical + structured data tags remain.

---

## Rollout Notes
- Deploy alongside any other route moves to avoid half-migrated navigation (e.g., ensure header links already point to `/collection/...`).
- Because the layout route shares a loader, cached data for categories/nav is centralized, which slightly changes cache headers (should match other routes).
- If SSR cache or CDN rules look for `/routes/__index/...`, update them to the new path if relevant.

Once these steps are finished, the collection experience is fully managed inside `app/routes/collection`, aligned with React Router 7 conventions, and ready for future incremental improvements.

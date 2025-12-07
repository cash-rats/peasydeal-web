# Catalog Layout Data Strategy

## Goals
- Cut repeated calls to `fetchCategoriesWithSplitAndHotDealInPlaced` during client navigation.
- Keep catalog chrome (header/footer/nav) available wherever needed without bloating non-catalog pages.
- Preserve SSR correctness and avoid breaking error boundaries that expect category data.

## Current State
- `CatalogLayout` lives in `app/components/layouts/CatalogLayout.tsx` and is imported by multiple catalog-related routes (`_index`, `collection`, `product`, `promotion`, `cart`, `checkout`, `payment`, `search`, etc.).
- Each of those routes runs its own loader that calls `fetchCategoriesWithSplitAndHotDealInPlaced`, causing the API to be hit on every route transition.
- `app/root.tsx` loader currently returns env + `gaSessionID` only; layout wrapper is a thin `Layout` component.

## Options Considered

### A) Move `CatalogLayout` and fetch into `app/root.tsx`
- Pros: Single loader source; can add `shouldRevalidate` to skip client-side refetch; categories available everywhere via `useRouteLoaderData('root')`.
- Cons: Root loader still runs once per SSR request; adds category payload to all routes (including non-catalog); forces catalog chrome into error boundaries and utility pages unless heavily conditionalized; larger HTML payload for non-catalog screens.

### B) Keep `CatalogLayout` where used; hoist data to a shared loader/context
- Shape: Fetch categories in a shared parent (root loader or a catalog-specific parent route), expose via `useRouteLoaderData`, keep `CatalogLayout` scoped to catalog pages.
- Pros: Removes per-route duplicate fetches; keeps non-catalog pages lean; allows `shouldRevalidate` on the shared parent to keep data sticky during SPA navigation; easier to keep catalog chrome off utility/auth screens.
- Cons: Requires refactoring catalog routes to read shared data; error boundaries must still render with categories (either from shared data or a guarded fallback).

### C) Leave structure as-is but cache inside `fetchCategoriesWithSplitAndHotDealInPlaced`
- Pros: Minimal surface change; protects backend from duplicate hits via TTL/memo.
- Cons: Still wires loaders per-route and repeats serialization; relies on cache correctness and invalidation discipline.

## Recommendation
Follow Option B: keep `CatalogLayout` scoped to catalog pages, but lift category fetching to a shared loader (root or a catalog parent), and add `shouldRevalidate` to avoid re-fetching on GET navigations. Use a short TTL cache inside `fetchCategoriesWithSplitAndHotDealInPlaced` as a safety net.

Rationale:
- Avoids forcing catalog chrome/payload onto every route.
- Eliminates duplicate client navigations’ fetches with `shouldRevalidate`.
- Keeps SSR behavior correct per request while keeping SPA hops cheap.

## Implementation Plan
1) **Shared data source**
   - Move the categories fetch into `app/root.tsx` loader (or a catalog parent layout route if you prefer scoping).
   - Return `{ categories, navBarCategories }` alongside existing root data.
   - (Optional) Add an in-memory/Redis TTL cache (e.g., 5–10 minutes) inside `fetchCategoriesWithSplitAndHotDealInPlaced` to protect the origin even on SSR hits.

2) **Prevent client-side refetch**
   - In the shared route, implement:
     ```ts
     export function shouldRevalidate({ formMethod }: { formMethod?: string }) {
       if (formMethod && formMethod.toUpperCase() !== 'GET') return true;
       return false; // keep categories sticky on GET navigations
     }
     ```
   - If categories truly never change until full reload, `return false` unconditionally is acceptable; keep the mutation check if other root data might need revalidation.

3) **Consume shared data**
   - Update catalog routes to stop calling `fetchCategoriesWithSplitAndHotDealInPlaced` in their loaders.
   - In each catalog route component, pull `categories`/`navBarCategories` via `useRouteLoaderData('root')` (or the catalog parent route id) and pass into `CatalogLayout`.

4) **Error boundaries and non-catalog routes**
   - Ensure error boundaries that render catalog chrome also read the shared data; fall back to empty arrays if root data is unavailable.
   - Keep non-catalog routes (e.g., tracking) free of catalog chrome unless explicitly desired; they can still read shared data if needed without extra fetches.

5) **Type safety**
   - Extend the root loader return type to include categories.
   - Add a small helper type for `RootLoaderData` to avoid repetition in route components.

6) **Verification**
   - Devtools: navigate across catalog routes and confirm the categories API is only hit on the initial load (network tab).
   - SSR smoke: hit a few catalog URLs directly to confirm loader still runs per request and renders header/footer correctly.
   - Error path: force a 500 in a catalog route and confirm error boundary renders with nav/categories from shared data or safe defaults.

## TODO (live execution)
- [x] Hoist categories/navBar fetch into `app/root.tsx` loader, add `shouldRevalidate`, and export `RootLoaderData`.
- [x] Refactor catalog routes (`_index`, `collection`, `product`, `promotion`, `cart`, `checkout`, `payment`, `search`, `tracking` if needed) to read categories from root data instead of their own loaders.
- [x] Adjust error boundaries that show catalog chrome to consume shared data or fall back safely.
- [x] Remove obsolete imports/loaders/types after refactor and ensure links arrays stay intact.
- [ ] Run/outline verification steps (typecheck/lint if feasible) and document any manual checks needed.

## Static policy/info pages (about-us, contact-us, etc.)
- These routes now read categories/nav data from the root loader via `useRouteLoaderData('root') as RootLoaderData | undefined`, and wrap their existing content in `CatalogLayout` with `cartCount` from `useCartCount()`. Example:
  ```ts
  import type { LinksFunction } from 'react-router';
  import { useRouteLoaderData } from 'react-router';
  import CatalogLayout, { links as CatalogLayoutLinks } from '~/components/layouts/CatalogLayout';
  import type { RootLoaderData } from '~/root';
  import { useCartCount } from '~/routes/hooks';

  export const links: LinksFunction = () => [...CatalogLayoutLinks()];

  export default function AboutUs() {
    const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
    const categories = rootData?.categories ?? [];
    const navBarCategories = rootData?.navBarCategories ?? [];
    const cartCount = useCartCount();

    return (
      <CatalogLayout categories={categories} navBarCategories={navBarCategories} cartCount={cartCount}>
        {/* existing page content */}
      </CatalogLayout>
    );
  }
  ```
- Keep loaders/meta as-is (Contentful fetchers stay in the same file). A separate `_index` child route is unnecessary unless we later add nested pages under these slugs.

# Product Route Migration Plan

This document outlines how to migrate the legacy `__index/product/$prodId.tsx` Remix Run route into the current React Router 7 setup.

---

## Goals
- Keep the existing product-detail UX and server logic stable.
- Adopt the new `/product` layout + `/product.$prodId` content pattern already used by other routes (e.g. `/collection`).
- Remove remaining Remix-only exports (`handle.dynamicLinks`, `CatchBoundary`) in favor of React Router 7 equivalents.

---

## Step-by-step Plan

1. **Create `/product` Layout Route**
   - Add `app/routes/product/route.tsx`.
   - Loader fetches `categories`/`navBarCategories` via `fetchCategoriesWithSplitAndHotDealInPlaced`.
   - Use `useRouteLoaderData('root')` for `cartCount`.
   - Render `CatalogLayout` (same approach as `/collection` and `/promotion`).
   - Export `links` that spreads `CatalogLayoutLinks`.

2. **Move Product Detail Route**
   - Create `app/routes/product.$prodId/route.tsx`.
   - Copy logic from `__index/product/$prodId.tsx`.
   - Update imports to point at the new sibling directory (`./components`, `./hooks`, etc.).
   - Replace `data(...)`/`json(...)` helpers imported from `'react-router'` (already available) instead of relying on Remix’s globals.

3. **SEO + Meta**
   - Re-use `__index/product/meta.ts`, but update `meta` to rely on canonical data from the loader, eliminating `handle.dynamicLinks`.
   - Ensure canonical link and OG tags still come from the loader result.

4. **Error Handling**
   - Replace `CatchBoundary` with `export function ErrorBoundary()` that:
     - Uses `useRouteError()` and `isRouteErrorResponse()`.
     - Renders `<FourOhFour />` for 404s; fall back to `<FourOhFour />` for other errors (matching other routes).

5. **Session + Actions**
   - Keep `action` logic intact, but confirm imports (`insertItem`, `commitSession`, etc.) resolve relative to the new folder.
   - Verify `loader` continues to redirect old URLs using `redirectToNewProductURL`.

6. **Folder Relocation**
   - Move the supporting directory currently under `__index/product` (components, hooks, reducer, styles, utils, etc.) into `app/routes/product.$prodId/`.
   - Update relative import paths if necessary (most should remain `./`).
   - Remove the obsolete `__index/product` folder once everything compiles.

7. **Routing Config**
   - `flatRoutes()` auto-detects `app/routes/product` entries, so no manual config changes expected.
   - Clean up any references pointing at the old `__index` location (search for `__index/product`).

8. **Testing + Verification**
   - `npm run lint`
   - `npm run typecheck`
   - `npm run test` (optional but recommended if touched hooks/components have coverage)
   - Manual smoke test: `npm run dev`, navigate to `/product/<id>` ensuring layout renders with header/footer, cart count, etc., and add-to-cart flow still works.

---

## Risks & Mitigations
- **Broken relative imports**: move directories carefully and run TypeScript to catch missing modules.
- **SEO regressions**: confirm `meta` still emits canonical + OG tags.
- **Session/cart regressions**: run through `add to cart` to ensure `action` + session cookies behave as before.

---

## Deliverables
1. `app/routes/product/route.tsx` layout.
2. `app/routes/product.$prodId/route.tsx` detail route plus supporting files relocated.
3. Updated `meta`, `links`, and `ErrorBoundary`.
4. Removed legacy `__index/product` files.
5. Passing lint + typecheck.

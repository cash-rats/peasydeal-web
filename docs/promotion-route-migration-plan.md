# Promotion Route Migration Plan

## Context
- Current implementation for `promotion` pages lives under `__index/promotion/*` and still uses Remix-era APIs (`data()`, `DynamicLinksFunction`, Chakra UI components, etc.).
- Goal is to migrate to React Router 7 conventions by introducing proper route folders under `app/routes/`.
- Supporting modules (`loaders`, `reducer`, `structured_data`, etc.) need to move alongside the new routes.

## Target Structure
```
app/
└── routes/
    ├── promotion/
    │   └── route.tsx          # Layout loader + header/footer shell (similar to collection layout)
    └── promotion.$promotion/
        ├── route.tsx          # Detail route component and loader/action/meta
        ├── loaders.ts         # loadProducts / loadMoreProducts returning Response.json
        ├── reducer.ts
        ├── structured_data.ts # RR7-compatible export
        └── types.ts
```

## Migration Steps
1. **Audit & Prep**
   - Review all dependencies from the existing `__index/promotion` files (sessions, API helpers, shared components) to ensure they are RR7-safe.
   - Confirm there are no conflicting `app/routes/promotion*` files.

2. **Create Promotion Layout Route**
   - Add `app/routes/promotion/route.tsx` modeled after `app/routes/collection/route.tsx`.
   - Loader fetches `fetchCategoriesWithSplitAndHotDealInPlaced`, returns `Response.json`.
   - Render `Header`, `Footer`, `CategoriesNav`, `DropDownSearchBar`, `MobileSearchDialog`, and `<Outlet />`.
   - Export aggregated `links` for header/footer/nav/search CSS.

3. **Port Detail Route**
   - Move logic from `__index/promotion/$promotion.tsx` into `app/routes/promotion.$promotion/route.tsx`.
   - Update loader to inspect `request.url`, switch on `action_type`, and call the shared loaders.
   - Replace `DynamicLinksFunction` by emitting canonical URL via `meta`.
   - Update `useFetcher` handling to rely on `fetcher.state`/`fetcher.data`.
   - Swap Chakra breadcrumbs/progress/buttons for existing shadcn/Tailwind primitives (similar to collection route & custom progress component).

4. **Relocate Support Modules**
   - Move `loaders.ts`, `reducer.ts`, `types.ts`, `structured_data.ts` into the new route folder (or a nested `shared` folder) and adjust import paths.
   - Update loaders to `return Response.json(...)` / `throw Response.json(...)` instead of `data()`.
   - Ensure structured data exports match RR7 expectations (no remix-utils types).

5. **Cleanup Legacy Files**
   - Delete the old `__index/promotion/*` files once new routes compile.
   - Verify `react-router.config.ts` or any route manifest no longer references the legacy paths.

6. **Verification**
   - Run `npm run typecheck` and `npm run lint`.
   - Launch `npm run dev`, navigate to `/promotion/:promotion`, exercise pagination (`useFetcher.submit`), breadcrumbs, and canonical tags.

## Risks / Considerations
- Session calls (`addCategoryProducts`, `commitSession`) must keep working after moving files—double-check relative imports.
- Shared UI still using Chakra (e.g., `LoadMoreButtonProgressBar`) may need parallel migrations to shadcn; budget extra time.
- Need to ensure existing analytics/tracking calls remain unchanged during the refactor.

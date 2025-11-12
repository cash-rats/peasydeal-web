
# Landing Page Migration Plan

## Goal
Move the legacy Remix root route found in `__index/index.tsx` into the React Router 7 file-route convention so that `/` is served from `app/routes/_index/route.tsx` without the transitional `__index` directory.

## Step-by-step
1. **Snapshot the current module**
   - Review `__index/index.tsx` to capture its exports (`links`, `loader`, `ErrorBoundary`, default `Index`) and verify all imports so nothing is lost during the move.

2. **Update the official `_index` route module** (`app/routes/_index/route.tsx`)
   - Replace the placeholder JSX with the full landing page component from `__index/index.tsx`.
   - Copy over the `links`, `loader`, and `ErrorBoundary` exports.
   - Merge any helper types (e.g., `LoaderDataType`) and ensure imports resolve via existing `~` aliases.
   - Keep any existing `_index`-specific logic (search dialog, header/footer scaffolding) only if it is still required after the merge; otherwise remove it to avoid dead code.
   - Confirm Tailwind classes and component props remain unchanged to preserve UI behavior.

3. **Delete the legacy directory**
   - Remove `__index/` (and `_index.disabled/` if it is no longer needed) once the new route compiles. This prevents duplicate route definitions.

4. **Type + lint checks**
   - Run `npm run typecheck` and `npm run lint` to ensure the new module matches the project’s TS + ESLint expectations.

5. **Functional smoke test**
   - `npm run dev`, hit `http://localhost:5173/`, and confirm the landing sections (hero, activities, category previews, promos, modal) still render and behave as before.

6. **Commit guidance**
   - Create a single commit titled something like `Move landing page to RR7 index route` that includes the new `route.tsx` content and removal of the old folder.

## Notes
- If additional shared utilities emerge during the move, place them under `app/lib` or `app/components` instead of nesting inside the route file.
- Keep the `links` export up to date with any component-level styles (e.g., `AllTimeCoupon`, `PromoCarousell`).
- Should new environment variables be required by the loader, add them to `remix.env.d.ts` before shipping.

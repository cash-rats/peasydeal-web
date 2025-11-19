# Blog Route Migration Plan

## Goal
Align every `/blog` route module with the React Router 7 file structure so that the blog layout and index behave the same as the other sections (`cart`, `collection`, etc.). The change is organizational—no loader/UI logic adjustments are expected.

## Current Findings
1. `app/routes/blog.tsx` acts as the layout parent (fetches categories, renders `Header`/`Footer`, etc.) but still lives at the v1 Remix location instead of `blog/route.tsx`.
2. `app/routes/blog/index.tsx` serves the landing page loader/UI. React Router 7 expects this file to live under `blog._index/route.tsx` (or `blog/route.tsx` + `_index` sibling) so the index route is explicit.
3. Child routes (`blog/page/$page.tsx`, `blog/post/$blog.tsx`) already follow the modern pattern and only depend on the parent’s context via `Outlet`, so moving the parent/index won’t require code changes there.

## Step-by-Step Plan
1. **Create layout directory**  
   - Move `app/routes/blog.tsx` → `app/routes/blog/route.tsx`.  
   - Adjust import paths only if any relative ones break (currently they are all app-root aliases, so no edits should be needed).  
   - Verify exports (`links`, `loader`, `meta`, default component) remain unchanged.

2. **Convert the index route**  
   - Create `app/routes/blog._index/route.tsx`.  
   - Move the existing `app/routes/blog/index.tsx` contents into the new file and delete the old one.  
   - Update relative imports (`./api`, `./components/BlogLayout`, `./images/*`, `./styles/*`) so they reference the new parent folder (e.g., `~/routes/blog/api`).  
   - Keep the `links`, `loader`, and `meta` implementations intact—only path updates and potential type imports should change.

3. **Smoke check**  
   - Run `npm run lint` (and optionally `npm run typecheck`) to ensure the move didn’t introduce circular imports or missing files.  
   - If time permits, `npm run dev` and verify `/blog`, `/blog/page/:page`, and `/blog/post/:slug` render correctly.

## Risks & Mitigations
- **Broken asset imports** – Moving the index file alters relative paths to `images`/`styles`. Double-check each import while relocating to avoid runtime 404s.  
- **Route hierarchy regressions** – After the move, confirm the new layout still wraps child routes (React Router uses folder-based ids). Running the dev server and clicking through blog routes will expose any misconfiguration.

## Success Criteria
- `app/routes/blog/route.tsx` exists and exports the same loader/layout logic as before.
- `app/routes/blog._index/route.tsx` serves the blog landing page, loading static posts and styles successfully.
- Child blog routes continue to work without additional adjustments.

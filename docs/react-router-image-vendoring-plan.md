# React Router Image Vendoring Plan

## Goals
- Stop importing `react-router-image` as a workspace dependency so Vercel builds no longer need to install or compile `packages/react-router-image`.
- Keep the existing loader behavior for `app/routes/remix-image/route.tsx`, including CDN-first reads, `MemoryCache`, and the Sharp-based transformer.
- Minimize future maintenance by keeping the vendored code in a clearly documented location inside the app.

## Current State
- `packages/react-router-image` exposes the server utilities (`imageLoader`, `MemoryCache`, helper types) that the Remix image route depends on.
- Root `package.json` runs `npm --prefix packages/react-router-image run build` before every build and references the package via `"react-router-image": "file:packages/react-router-image"`.
- Only `app/routes/remix-image/route.tsx` and `app/routes/remix-image/transformer.ts` import from this workspace module.

## Migration Plan
1. **Choose Vendor Location**
   - Create `app/lib/react-router-image/` and mirror the current `src` layout (`index.ts`, `server`, `types`, `utils`), keeping file names identical to avoid churn.
   - Document within the folder header (README or comment) that the code was forked from the local workspace.

2. **Copy Source Files**
   - Move everything under `packages/react-router-image/src` into the new folder, keeping relative imports intact.
   - Update any internal path references if needed (e.g., `../types` still resolves relative to the new structure).

3. **Update Imports in the App**
   - Replace `react-router-image/server` and `react-router-image` imports with a path alias, e.g. `~/lib/react-router-image/server`.
   - Adjust `tsconfig.json` paths if necessary (e.g., add `"~/lib/*": ["./app/lib/*"]`) so TypeScript resolves the new modules without relative paths.

4. **Remove Workspace Package References**
   - Delete the dependency entry `"react-router-image": "file:packages/react-router-image"` from the root `package.json`.
   - Remove the `prebuild` script’s `npm --prefix packages/react-router-image run build` invocation (builds will operate on the vendored TS directly).
   - Delete the `packages/react-router-image` folder once the code is safely copied and referenced.

5. **Add Runtime Dependencies to Root**
   - Add the libraries previously pulled via the workspace package (`lru-cache`, `mime-tree`, `query-string`, `js-image-lib`) to the root `dependencies`.
   - Run `npm install` to refresh `package-lock.json`.

6. **Clean Up Docs & Scripts**
   - Update `docs/*` that refer to `packages/react-router-image` so they describe the vendored location.
   - Remove any unused helper packages or scripts that belonged exclusively to the old workspace (e.g., nested `packages/**` tooling).

7. **Verify**
   - Run `npm run lint`, `npm run typecheck`, and `npm run build`.
   - Hit `/remix-image` in dev with existing query patterns to ensure cache hits/misses still behave as before.
   - Confirm the Vercel build no longer attempts to build the old workspace.

## Notes / Risks
- Ensure the vendored `pureTransformer` stays intact even if the Sharp transformer is primary; it’s used as a fallback inside `imageLoader`.
- Keep the node-friendly `MemoryCache` behavior identical so CDN + cache logic is unaffected.
- After removing the workspace, double-check CI/CD configs that might have mentioned it (e.g., references in docs or scripts) to avoid stale instructions.

# React Router Image Migration Plan (Node 22 + React Router 7)

This document describes how to replace the unmaintained `remix-image` dependency with a self-maintained fork under `packages/react-router-image`, tailored specifically for:

- Node `>= 22.x` (no `better-sqlite3` / `@next-boost/hybrid-disk-cache`).
- React Router 7 data APIs.
- The **actual** usage pattern in `app/routes/remix-image/route.tsx`.

The goal is to support the current CDN-first image flow while minimizing the surface area we maintain from the original `remix-image` repo.

---

## 1. Current Usage and Behavior

### 1.1 Where `remix-image` is used

- Route: `app/routes/remix-image/route.tsx`
- Imports:
  - `imageLoader`, `MemoryCache` from `remix-image/server`
  - `LoaderConfig` from `remix-image`

There is no app-level use of `DiskCache` or third-party loaders (Cloudinary, Imgix, Cloudflare, etc.).

### 1.2 Route Flow Overview

When an image request hits the `remix-image` route:

1. Parse query params: `width`, `height`, `src`, `contentType`.
2. If `src` is missing → return `badImageResponse()` (1×1 GIF).
3. If `width`, `height`, `src`, and a mapped `fileExt` are present:
   - Derive a CDN URL under `envs.CDN_URL` via `composeCDNUrl`.
   - `fetch` this URL:
     - If `response.ok` and has a body → return this buffer via `imageResponse` with `Cache-Control: public, max-age=365 days`.
4. If CDN lookup fails or is not applicable:
   - Call `imageLoader(config, request)`.

### 1.3 `LoaderConfig` and Transformer

Current `config`:

- `selfUrl`: `${envs.CDN_URL}/product-images`
- `cache`: `new MemoryCache()` (in-memory only).
- `transformer`: custom `transformer` from `app/routes/remix-image/transformer.ts`.

Custom transformer characteristics:

- Depends on `sharp` and `TransformOptions` from `remix-image`.
- `supportedInputs`/`supportedOutputs`: JPEG/JPG/PNG/GIF/WEBP/TIFF (+ AVIF in MIME enum).
- Performs:
  - Optional crop.
  - Resize with fit/position/background.
  - Optional flips and rotation.
  - Optional blur.
  - Encodes into multiple formats and forces the correct one based on `outputContentType`.
- On successful transform:
  - Derives an object name based on `width`, `height`, file name, and output extension.
  - In `production`/`staging`, uploads the transformed buffer to R2 via `uploadToR2`.
  - Returns the transformed image as `Uint8Array`.

### 1.4 `imageLoader` (from forked `remix-image`)

Key points from `packages/react-router-image/packages/remix-image/src/server/loaders/imageLoader.ts`:

- Accepts a configuration object `{ selfUrl, cache, resolver, transformer, ... }` and a `Request`.
- Responsibilities:
  - Parse `src` + transformation query params.
  - Validate width/height bounds.
  - Generate a cache key (e.g. query string).
  - Check `cache` (`MemoryCache` or `DiskCache`) for existing transformed buffer.
  - If miss: resolve original image via `resolver` (default `fetchResolver`).
  - Run `transformer` if needed, respecting `supportedInputs`, `supportedOutputs`, `fallbackOutput`.
  - Store result in cache if configured.
  - Return a `Response` using `imageResponse` utility.

For our app, we use:

- `MemoryCache` (pure JS).
- Custom `transformer` backed by `sharp`.
- No `DiskCache`, `@next-boost/hybrid-disk-cache`, or native SQLite.

---

## 2. Constraints and Goals

### 2.1 Constraints

- Node version: **must be 22.x** (or newer).
- Routing: **React Router 7** loader semantics (`LoaderFunctionArgs`, `Request`, `Response`).
- No native `better-sqlite3` dependency in install path.
- Preserve existing CDN-first, R2-backed behavior.

### 2.2 Goals

- Create a minimal, self-maintained image library under `packages/react-router-image` that:
  - Works on Node 22 with no `better-sqlite3`.
  - Exposes a server API compatible with current usage:
    - `imageLoader`
    - `MemoryCache`
    - `LoaderConfig`
    - `TransformOptions`
  - Optionally preserves the client `<Image>` component / hooks for future use, but not required for the current route.
- Update the app to depend on `@packages/react-router-image` instead of `remix-image`, without altering the route’s high-level behavior.

---

## 3. Target API Design for `@packages/react-router-image`

### 3.1 Package Layout

We will treat `packages/react-router-image` as the monorepo fork and expose a *thin* public API for the app:

- Root package (workspace):
  - `name`: e.g. `"@huangc28/react-router-image"` or `"@packages/react-router-image"`.
  - `workspaces`: already configured in the fork; we just wire a single public entry for the app.

- Public server entry:
  - `@packages/react-router-image/server` exports:
    - `imageLoader`
    - `MemoryCache`
    - `type LoaderConfig`
    - `type TransformOptions`
    - (Optionally) `MimeType` and some error types.

- Optional client entry:
  - `@packages/react-router-image`:
    - Default export: `<Image>` component.
    - `useResponsiveImage` and any helpers we choose to keep.
  - Not required for the current route but useful for future refactors.

### 3.2 Types and Contracts

- `LoaderConfig`:
  - Must be compatible with the existing `config` object:
    - `selfUrl: string`
    - `cache: MemoryCache | null`
    - `transformer: { ... }` with the same shape as today.
    - Optional additional fields (`redirectOnFail`, `skipFormats`, `whitelistedDomains`, etc.) can remain supported but unused by our route.

- `TransformOptions`:
  - Retain the current `remix-image` fields:
    - `width`, `height`, `fit`, `position`, `background`, `quality`, `compressionLevel`, `loop`, `delay`, `blurRadius`, `rotate`, `flip`, `crop`, `contentType`, etc.
  - This ensures `transformer.ts` can continue importing `TransformOptions` without change beyond the module path.

- `MemoryCache`:
  - Pure JS in-memory cache, no dependencies on disk or native modules.
  - Same semantics as in the original `remix-image` implementation.

### 3.3 Runtime Expectations

- Server API is based on the Web Fetch primitives:
  - `imageLoader(config, request: Request): Promise<Response>`
  - This aligns with both Remix and React Router 7 loaders, so we do not need any extra glue code.
- No reliance on Node-specific frameworks; pure `fetch`-style handling.

---

## 4. Removing Native Disk Cache Dependencies

### 4.1 Identify and Isolate Disk Cache Usage

In the forked repo:

- File: `packages/react-router-image/packages/remix-image/src/server/caches/diskCache.ts`
  - Imports `BaseCache` from `@next-boost/hybrid-disk-cache`.
  - This package in turn depends on `better-sqlite3`, which requires native compilation.

- `DiskCache` is then exported from:
  - `packages/remix-image/src/server/caches/index.ts` (and re-exported via `server/index.ts`).
  - Docs and examples (`sharp.md`, `web-assembly.md`, etc.) reference `DiskCache`, but the **app does not**.

### 4.2 Strategy: Exclude Disk Cache from App-Facing API

To avoid `better-sqlite3`:

1. **Do not export `DiskCache`** from the app-facing `@packages/react-router-image/server` entry.
2. Remove `@next-boost/hybrid-disk-cache` from:
   - Root `dependencies` in `packages/react-router-image/package.json` (unless needed for non-app tooling).
   - `peerDependencies` in `packages/remix-image/package.json`.
3. Ensure the app itself does not reference `DiskCache`:
   - Confirm with a repo search that only docs/examples use `DiskCache`.
4. Optionally keep the disk cache code in the fork for reference, but **not** in the build or exported API used by `peasydeal_web`.

Result:

- The path from `npm install` to your image loader no longer passes through any package that requires `better-sqlite3`.
- We rely solely on `MemoryCache` plus `sharp` (which you already depend on directly in the app).

### 4.3 Clean Up Root App Dependencies

In `peasydeal_web`:

1. Remove `@next-boost/hybrid-disk-cache` from root `dependencies` if it is not used elsewhere.
2. Regenerate `package-lock.json` to drop `better-sqlite3` entirely.
3. Verify that `rg "better-sqlite3"` in the repo returns no references apart from old lockfiles that are now replaced.

---

## 5. Integration Plan in `peasydeal_web`

### 5.1 Add and Wire the New Package

1. Ensure `packages/react-router-image` is part of root workspaces (already true).
2. Inside `packages/react-router-image`:
   - Define a package entry (if not already) that exposes:
     - `./server` → compiles and re-exports `imageLoader`, `MemoryCache`, `LoaderConfig`, `TransformOptions` from the fork’s `remix-image` source.
   - Set `"name"` to the value you want to import from, e.g. `"@huangc28/react-router-image"`.
   - Make sure `tsconfig` and build script (e.g. rollup/tsup) output Node-compatible code for React Router 7 server runtime.

### 5.2 Migrate Imports in the Route

Update `app/routes/remix-image/route.tsx`:

- Replace:

  ```ts
  import { imageLoader, MemoryCache } from 'remix-image/server';
  import type { LoaderConfig } from 'remix-image';
  ```

- With:

  ```ts
  import { imageLoader, MemoryCache } from '@huangc28/react-router-image/server';
  import type { LoaderConfig } from '@huangc28/react-router-image';
  ```

Assuming the new package name is `@huangc28/react-router-image`. Adjust to match the final name.

The rest of the route logic remains identical:

- Use `config: LoaderConfig` with `selfUrl`, `cache: new MemoryCache()`, and `transformer`.
- Use `imageLoader(config, request)` in the fallback path.

### 5.3 Migrate Types in `transformer.ts`

Update `app/routes/remix-image/transformer.ts`:

- Replace:

  ```ts
  import type { TransformOptions } from 'remix-image';
  ```

- With:

  ```ts
  import type { TransformOptions } from '@huangc28/react-router-image';
  ```

No other code changes should be necessary if `TransformOptions` is preserved as-is.

### 5.4 Reconciling `MimeType`

We already have `MimeType` defined locally in `app/routes/remix-image/mimes.ts`:

- You can continue using this local enum and treat it as compatible with the library’s internal types, as the transformer only cares about the value strings.
- Optionally, we can:
  - Export a `MimeType` enum from the new package and use that in the route, or
  - Keep the package’s `MimeType` internal and rely on the local enum.

For minimal churn, we keep using the local `MimeType` and ensure the transformer’s `supportedInputs`/`supportedOutputs` operate on those values.

---

## 6. React Router 7 Compatibility

### 6.1 Loader Signature

Current loader:

```ts
export const loader = async ({ request }: LoaderFunctionArgs) => {
  // ...
  return imageLoader(config, request);
};
```

This is already the correct form for React Router 7:

- Receives `LoaderFunctionArgs` with `request: Request`.
- Returns a `Response`.

Our new `imageLoader` must preserve:

- The call signature: `(config: LoaderConfig, request: Request) => Promise<Response>`.
- Behavior in error cases:
  - For our route, we rely on `badImageResponse()` for missing `src`.
  - For loader errors, we’re fine reusing the existing behavior from `remix-image` (standard HTTP error responses).

### 6.2 Client-Side Rendering Concerns

- The `remix-image` client component and hooks are not currently used in the app routes.
- React Router 7 compatibility is primarily a **server-loader** concern here.
- If we later adopt the `<Image>` component, we will ensure:
  - It uses standard React 18 patterns (hooks, `React.forwardRef`, etc.).
  - It is agnostic to Remix vs React Router 7, using only generic props and the configured image endpoint.

---

## 7. Validation Strategy (Node 22)

### 7.1 Dependency and Install Validation

1. Remove:
   - `@next-boost/hybrid-disk-cache` from app and fork dependencies (where not needed).
2. Run:
   - `npm install` on Node 22.
   - Confirm:
     - No `better-sqlite3` gets installed.
     - No `prebuild-install`/`node-gyp` errors apart from known `sharp` compilation, which is a separate concern.

### 7.2 Type-Level Validation

- Run `npm run typecheck`:
  - Ensure `LoaderConfig`, `TransformOptions`, `imageLoader`, and `MemoryCache` are correctly exported and used.
  - Check that the route and transformer compile using the new imports.

### 7.3 Behavior-Level Validation

With `npm run dev`:

1. **CDN hit path**:
   - Request an image URL with `width`, `height`, `src`, and supported `contentType` such that:
     - The CDN (`composeCDNUrl`) has the file.
   - Confirm:
     - Loader returns the CDN file.
     - `Content-Type` is `image/webp`.
     - `Cache-Control` is `public, max-age=365 days`.

2. **CDN miss → transformer path**:
   - Request an image not present on CDN but available at the original source.
   - Confirm:
     - Loader falls back to `imageLoader(config, request)`.
     - `imageLoader` uses `transformer` to produce the output buffer.
     - In staging/prod (with proper env), R2 upload is attempted.
     - Response contains transformed image bytes.

3. **Bad input path**:
   - Request without `src` or with invalid query.
   - Confirm:
     - `badImageResponse()` is returned with 400 and the 1×1 GIF.

### 7.4 Optional Testing

- Add a narrow unit/integration test that:
  - Mocks `fetch` to simulate CDN presence/absence.
  - Mocks the transformer to a trivial pass-through.
  - Confirms that:
    - CDN-hit case bypasses `imageLoader`.
    - CDN-miss case invokes `imageLoader` and returns the mocked transformed data.

---

## 8. Implementation Phases

### Phase 1: Prepare the Fork

1. In `packages/react-router-image`:
   - Confirm the `remix-image` source is intact.
   - Remove `@next-boost/hybrid-disk-cache` from dependencies/peerDependencies where our app does not require it.
   - Ensure `DiskCache` is not exported from the app-facing `server` entry.

2. Adjust build config:
   - Ensure we can produce a small `build/server` bundle with:
     - `imageLoader`
     - `MemoryCache`
     - `LoaderConfig`, `TransformOptions`

### Phase 2: Create Public Server Entry

1. Add `server` entrypoint in the package:
   - Re-export the selected pieces from `packages/remix-image/src/server`.
2. Align `package.json` exports:

   ```json
   "exports": {
     ".": "./build/index.js",
     "./server": "./build/server/index.js"
   }
   ```

3. Build and verify:
   - The types and runtime exports are correct via a small local import test.

### Phase 3: Swap Imports in `peasydeal_web`

1. Update `app/routes/remix-image/route.tsx` and `transformer.ts` to import from the new package.
2. Remove direct dependency on `remix-image` from root `package.json`.
3. Run `npm install`, `npm run typecheck`.

### Phase 4: Runtime Verification

1. Run `npm run dev` on Node 22.
2. Manually test the three scenarios:
   - CDN-hit.
   - CDN-miss with R2 upload.
   - Bad inputs.
3. Confirm no runtime errors or type mismatches.

---

## 9. Future Extensions (Optional)

Once the core path is stable:

- Consider exposing the `<Image>` component and `useResponsiveImage` hook from the forked package and slowly migrating any image-heavy routes to use them.
- Evaluate whether to support additional loaders (e.g., Cloudflare, Imgix) by selectively reviving only those parts of the original `remix-image` code that are needed, without reintroducing `DiskCache`/SQLite.
- Tighten types around `MimeType` so that app-level enums and library-level enums are unified.

This phased plan keeps the focus tightly on the **current `remix-image` route use case**, while modernizing the underlying library for **Node 22** and **React Router 7** and avoiding unnecessary maintenance surface.


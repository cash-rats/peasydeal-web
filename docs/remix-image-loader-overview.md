Remix image route overview
==========================

Context
-------
- Entry point: `app/routes/remix-image/route.tsx` exposes a loader that proxies/derives images with optional CDN short-circuiting.
- Local helpers live alongside the route (`transformer.ts`, `mimes.ts`, `response.ts`, `r2.ts`, `gcs.ts`) while the underlying loader utilities are vendored under `app/lib/react-router-image`.

Request flow
------------
- Query params: `width`, `height`, `src`, `contentType` (defaults to `image/webp`); missing `src` returns a 1x1 GIF via `badImageResponse`.
- CDN probe: when width/height/src are present, builds `${CDN_URL}/webp/w{w}_h{h}/{filename}{ext}` (extension derived from `contentType`) and returns it with `public, max-age=1y` if found.
- Fallback: delegates to `imageLoader` with `selfUrl: ${CDN_URL}/product-images`, in-memory LRU cache, and the Sharp-based transformer. Cache hits skip transformation; cache-control is 1y (or private with TTL metadata when cached).

Transformation (`app/routes/remix-image/transformer.ts`)
-------------------------------------------------------
- Uses Sharp; supports JPEG/JPG/PNG/GIF/WEBP/TIFF inputs/outputs (also AVIF encoding when requested).
- Steps: ensure alpha → optional crop → resize (fit/position/background) → flip → rotate → blur → encode with format-specific options (quality/compression/loop/delay).
- When width/height and an output extension exist, uploads the transformed buffer to Cloudflare R2 in `production`/`staging` using key `{ext}/w{w}_h{h}/{filename}`; dev skips uploads.

Supporting pieces
-----------------
- MIME/extension mapping: `mimes.ts` maps enum to file extensions (includes AVIF and SVG).
- Responses: `response.ts` builds image/text responses; route-specific `badImageResponse` returns a minimal GIF with `400`.
- R2 client: `r2.ts` initializes an S3-compatible client for Cloudflare R2 in prod/staging; throws if used when uninitialized.
- GCS helper: `gcs.ts` provides a streaming uploader to a GCS bucket (only initialized in prod/staging); currently unused by the route.

Vendored loader internals (`app/lib/react-router-image`)
--------------------------------------------------------
- `server/imageLoader.ts`: validates `selfUrl`, requires width (<=8000), enforces whitelist/blacklist, fetches source via resolver (default `fetchResolver`), and transforms via configured transformer with fallback format/transformer handling and cache integration. Errors return text responses or redirects when enabled.
- `server/memoryCache.ts`: LRU cache keyed by querystring with TTL/size caps.
- `server/pureTransformer.ts`: js-image-lib fallback transformer.
- Utilities: URL/query parsing, response helpers, MIME typing, and transformer/loader types.

Environment considerations
-------------------------
- Depends on `CDN_URL` for probing and `product-images` base, plus `R2_*` credentials for uploads; behavior gated by `NODE_ENV` (`production`/`staging` vs development).

Perf improvement approach
-------------------------
- Frontend should compose the CDN URL (same shape as the route probe) and hit CDN first. If the CDN returns 200, render directly—no `/remix-image` call.
- On CDN miss/error, call `/remix-image`; the loader will transform, upload to R2, and (proposed) 302 to the freshly uploaded CDN URL after success. If upload fails, fall back to returning the transformed buffer with shorter cache.
- This removes the always-on pass-through hop, cutting app server load and latency while keeping a server fallback for new sizes.

Implementation plan
-------------------
- Client: add a helper to compose CDN URLs for a given `src`, `width`, `height`, `contentType`; probe via HEAD or image load with `onerror` fallback. Cache probe results per `src|w|h|type`.
- Client: on probe hit, render CDN URL; on probe miss/error, call `/remix-image` as today.
- Server: in `/remix-image`, after transform and successful R2 upload, respond with 302 to the CDN URL for that size; on upload failure, return the buffer with conservative cache headers.
- Server: keep MemoryCache active to avoid repeat transforms during bursts; use the same cache key (`search`).
- Testing: add unit coverage for CDN URL composition and probe fallback; add integration test that simulates CDN miss → loader path → redirect, and ensures direct CDN usage on subsequent requests.

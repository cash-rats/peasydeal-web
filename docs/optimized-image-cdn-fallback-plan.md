# OptimizedImage CDN-first fallback plan

## Context / Problem
- Mobile product listing images flicker (appear-disappear-reappear) when entering viewport on `/` and `/collection/$collection`.
- Root cause: `OptimizedImage` probes CDN availability after an image starts loading, toggling `useCdn` mid-flight and swapping `src`/`srcset`, forcing a second request and brief blank.

## Goals
- Keep image source stable during initial load to eliminate flicker.
- Prefer CDN when available, but gracefully fall back to the loader route if CDN misses (size not seeded yet) or fails.
- Avoid per-image HEAD probes and minimize extra network churn.

## Plan
- Default source: render with CDN URLs immediately when a CDN base URL is configured.
- Per-image fallback: on `img` error, flip a local flag and re-render once with loader URLs (no mid-flight swaps while the initial request is in-flight).
- Scoped cache: keep a module-level `Map` keyed by `src|width|height` of CDN failures. If a size missed once (because it isn’t seeded yet), skip CDN for that exact size during the session; other sizes still try CDN first.
- Keep `srcset`/`sizes` generation consistent across CDN/loader to avoid layout shifts; only the base URL should differ.
- Preserve existing features: lazy-load via `IntersectionObserver`, blur placeholders, aspect-ratio styling, `onLoadingComplete` callback.

## Implementation steps
1) Add a module-level `Map<string, boolean>` to cache CDN failures per `src|width|height` key.
2) In `OptimizedImage`, derive `preferCdn = Boolean(envs.CDN_URL) && !failureMap.has(key)` for each size.
3) Generate CDN URLs without HEAD probes; pick CDN or loader URLs based on `preferCdn` and local fallback state.
4) Update `src`, `srcSet`, and `sizes` to use a shared builder that accepts the chosen base (CDN or loader), keeping dimensions identical.
5) On `onError`, if currently using CDN, mark the key as failed in the map, flip local `useCdnForThisImage` to false, and re-render once; ensure no loop when already on loader.
6) Remove the async CDN probing effect and related state.
7) Test manually on mobile/DevTools: scroll product list to confirm no flicker; verify CDN miss falls back to loader and seeded images load on subsequent views.

## Risks / Mitigations
- If CDN intermittently fails, global cache may disable CDN for the session; acceptable to favor stability. Can later add expiry/backoff if needed.
- Ensure fallback doesn't cause infinite re-render: guard `onError` to only switch once.
- CDN URL composition relies on `envs.CDN_URL`; keep error handling/logging for malformed URLs.

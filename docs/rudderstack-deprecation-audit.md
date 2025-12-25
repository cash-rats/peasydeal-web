# RudderStack Deprecation Audit (GTM Migration)

Status: RudderStack runtime usage has been removed from `app/` and replaced with GTM `dataLayer` events via `trackEvent(...)`. Remaining mentions are in legacy/backup folders and documentation.

## What I checked

Searched the codebase for:
- `rudder`, `rudderstack`, `rudderanalytics`
- `useRudderStackScript`, `~/hooks/rudderStack`
- `RUDDER_STACK_KEY`, `RUDDER_STACK_URL`

## Active RudderStack usage (historical; now migrated)

### Script/env wiring
- Removed `useRudderStackScript` from `app/root.tsx`
- Deleted `app/hooks/useRudderStackScript.tsx`
- Removed `RUDDER_STACK_KEY` / `RUDDER_STACK_URL` from `app/utils/env.ts`

### Hook wrapper
- Deleted `app/hooks/rudderStack.tsx` and replaced its usage with `app/hooks/useSearchActionSubmitEvent.tsx`

### Direct event tracking calls (`window.rudderanalytics?.track(...)`)

All calls under `app/` have been migrated to `trackEvent(...)` (GTM `dataLayer.push`).

**Header / navigation**
- `app/components/Header/components/NavBar/index.tsx`

**Collections / categories / promos**
- `app/components/CategoryPreview/index.tsx`
- `app/components/CategoriesRow/index.tsx`
- `app/components/PromoActivities/PromoActivities.tsx`
- `app/components/PromoCarousell/index.tsx`
- `app/components/AllTimeCoupon/index.tsx`

**Search / Algolia**
- `app/hooks/rudderStack.tsx`
- `app/components/MobileSearchDialog/SearchBar.tsx` (imports `~/hooks/rudderStack`)
- `app/components/DropDownSearchBar/Autocomplete.tsx` (imports `~/hooks/rudderStack`)
- `app/components/_DropDownSearchBar/index.tsx`
- `app/components/Algolia/RecentSearchHits.tsx`
- `app/components/Algolia/ProductHits.tsx`
- `app/components/Algolia/CategoryHits.tsx`

**Cart / checkout / purchase**
- `app/routes/cart/components/PriceResult/index.tsx`
- `app/routes/payment.$orderId/components/Success/index.tsx` (tracks `purchase`)

**Product page**
- `app/routes/product.$prodId/components/ProductActionBar/index.tsx`
- `app/routes/product.$prodId/hooks/useAddToCart.ts`
- `app/routes/product.$prodId/hooks/useProductChange.ts` (references `.rudderanalytics`)
- `app/routes/product.$prodId/route.tsx` (scroll + `.rudderanalytics` references)

**Other**
- `app/components/Carousel/CarouselMinimal.tsx` (contains `rudderanalytics?.`)

## Non-active/legacy locations (optional cleanup, but not runtime)

These appear to be backups/disabled routes and are likely not used in the running app, but they still contain RudderStack tracking calls:
- `routes.bk/**` (multiple RudderStack `.track(...)` calls)
- `_index.disabled/**` (multiple RudderStack `.track(...)` calls)
- `__index/mail/subscribe.tsx`, `__index/mail/unsubscribe.tsx`

## Dependencies / config references
- Removed `rudder-sdk-js` from `package.json` and `package-lock.json`
- Docs reference: `docs/buy-now-indexeddb-plan.md` mentions `window.rudderanalytics?.track('click_buy_now')`

## TODO: Migration plan (RudderStack → GTM)

- [ ] Inventory all events currently sent via `window.rudderanalytics?.track(...)` and `app/hooks/rudderStack.tsx` (event name + payload schema + where it fires).
- [ ] Define the GTM event contract (event names + required/optional params) and document it in `docs/` (include mapping from old RudderStack event names).
- [ ] Add a single shared tracking wrapper (e.g. `app/lib/analytics/trackEvent.ts`) that does `window.dataLayer?.push({ event, ...params })` and safely no-ops on SSR.
- [x] Replace direct `window.rudderanalytics?.track(...)` calls across `app/` with the new GTM wrapper (keep payload keys consistent with your GTM tags/triggers).
- [x] Migrate `app/hooks/rudderStack.tsx` call sites to the GTM wrapper; delete `app/hooks/rudderStack.tsx` once unused.
- [x] Update any UI components importing `~/hooks/rudderStack` to use the GTM wrapper (e.g. search components).
- [ ] Confirm page-view behavior: if RudderStack was doing implicit page calls, ensure GTM/`gtag` page_view is still correct for client-side navigation.
- [ ] Verify purchase/checkout events (`purchase`, promo, add-to-cart) match the GTM ecommerce schema you expect (if using GA4 ecommerce, align field names).
- [ ] Add minimal tests for the wrapper (ensures `dataLayer.push` called with expected shape; SSR-safe behavior).
- [x] Remove RudderStack loader: stop calling `useRudderStackScript` in `app/root.tsx`, then delete `app/hooks/useRudderStackScript.tsx` if unused.
- [x] Remove RudderStack env vars from `app/utils/env.ts` and any env docs (`RUDDER_STACK_KEY`, `RUDDER_STACK_URL`), and scrub usages.
- [x] Remove `rudder-sdk-js` from `package.json` (and lockfile) once no runtime references remain.
- [ ] Optional cleanup: delete/ignore legacy RudderStack references in `routes.bk/`, `_index.disabled/`, `__index/` (or clearly mark them non-prod).
- [ ] Run `npm run lint`, `npm run typecheck`, `npm run test`, and do a quick manual smoke test of key flows to confirm GTM events fire.

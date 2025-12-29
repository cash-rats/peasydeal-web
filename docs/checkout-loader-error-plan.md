# Checkout Loader Error Handling Plan

## Objectives
- Replace the loader's `try/catch` with the shared `tryCatch` helper for clearer error results.
- Adopt React Router 7 data-router error handling so loader failures render a user-facing error state on the checkout page.
- Keep existing checkout data flow (session, payment intent creation) intact while improving observability and resilience.

## Current State
- Loader in `app/routes/checkout/route.tsx` uses a broad `try/catch` and returns `Response.json` with status 500 on any error.
- No route-level `errorElement` or boundary exists, so user-facing errors are undefined; loader errors bubble to default handling.
- `app/utils/try-catch.ts` provides a tuple-style `tryCatch` helper returning `[result, error]` with console logging on failure.

## Proposed Loader Changes
- Use `tryCatch` for each asynchronous step that can fail:
  - `getCheckoutSession(request)`
  - `createPaymentIntent({ amount, currency })`
  - `commitCheckoutSession(session)`
- Pattern: destructure `[result, error]`, short-circuit and `throw` a `Response` (or `Error`) when `error` is present to trigger the route error boundary.
- Preserve redirect to `/cart` when no checkout data, before payment intent creation.
- Ensure returned loader data shape (`client_secret`, `payment_intend_id`, `price_info`, `promo_code`) remains unchanged.

## React Router 7 Error Display Strategy
- Add an `errorElement` for the checkout route (or export `ErrorBoundary`) that renders an error UI.
- In the boundary component:
  - Use `useRouteError()` to access the thrown `Response` or `Error`.
  - Use `isRouteErrorResponse(error)` to differentiate HTTP responses (e.g., 500) from generic errors.
  - Show a concise message (e.g., “Checkout is unavailable right now. Please try again.”) and optionally a retry link to `/cart` or home.
  - Optionally surface a request ID or status code for support/debug (avoid leaking sensitive details).
- Keep layout consistent: wrap error state with `CatalogLayout` if necessary so nav/cart counts still render.

## UX Notes
- Provide a clear headline and action button/link (e.g., “Return to cart”).
- Avoid flashing partial checkout UI when error occurs; render the boundary immediately.
- Consider logging/monitoring hook (if available) to capture error details without exposing them to the user.

## Implementation Steps
1) Refactor loader to use `tryCatch`, returning early on errors by throwing `Response` with proper status and message.
2) Add `ErrorBoundary`/`errorElement` to `app/routes/checkout/route.tsx` that renders a user-friendly error state using React Router 7 conventions.
3) Keep data contracts and successful path behavior unchanged; ensure Stripe/PayPal setup remains guarded by loader success.
4) Manually verify:
   - Successful checkout path still renders form.
   - Loader error path triggers boundary and shows error UI.
   - Redirect to `/cart` still works when checkout session is missing.

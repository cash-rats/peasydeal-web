## Goal
Restore `/checkout` to the pre-debug layout while replacing the old Redis-backed transaction session with a cookie-backed flow that still gives the server authoritative `price_info` and `promo_code`.

## Approach
1) Recreate the checkout loader/layout (from commit `385d0750`), but swap `getTransactionObject` for a new cookie session helper (e.g., `checkout.session.server.ts`) that stores `{ price_info, promo_code }` (and optionally a cart snapshot).  
2) On the cart page, before redirecting to `/checkout`, post the current cart + promo code to a server action/resources route. The server recomputes price via `fetchPriceInfo`/`calculateCartPriceAndSession`, writes it to the cookie session, and redirects to `/checkout`. Never trust client totals.  
3) In the checkout loader, read the cookie session; if missing/empty or cart empty, redirect to `/cart`. Otherwise, create the Stripe PaymentIntent from `price_info.total_amount` and pass `price_info` + `promo_code` to the outlet context as before.

## Notes / Open Points
- Consider also syncing the cart to a signed cookie whenever it changes so recompute in the prep action doesn’t rely on client payload timing.  
- Ensure the cookie session aligns with existing env settings (domain/path/secure flags) and is cleared on successful checkout.  
- Keep `shouldRevalidate` logic from the original route to avoid unintended loader churn on address lookups or header refreshes.

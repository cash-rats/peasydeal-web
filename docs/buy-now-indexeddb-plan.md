# Buy Now IndexedDB Migration Plan

## Context
- Current Buy Now flow posts to `/cart?index`, hits the `/cart._index` action to insert into the Redis session, then redirect to `/cart`.
- The cart page now hydrates from IndexedDB (`loadCartFromClient`) via `CartProvider`/`useLocalCart`, so session writes are ignored for rendering.

## Goals
- Add the Buy Now item into the IndexedDB-backed cart on the client.
- Navigate to `/cart` directly after updating local cart.
- Preserve analytics tracking for Buy Now clicks.

## Changes
- Update `app/routes/product.$prodId/components/ProductActionBar/index.tsx`:
  - Replace the `<Form>` submission with a client click handler.
  - Use `useCartContext` to read/update the cart map and persist to IndexedDB via `setCart`.
  - Add `added_time` when inserting the item; use existing image from `sessionStorableCartItem`.
  - Trigger `window.rudderanalytics?.track('click_buy_now')`.
  - Use React Router navigation (e.g., `useNavigate`) to go to `/cart` after writing the cart.
- Ensure no dependency on the `/cart._index` action for Buy Now.

## Validation
- Manual: On product page, click Buy Now -> redirected to `/cart` with the item present; page shows correct quantity/price.
- Smoke test existing add-to-cart flow to ensure counts still update via IndexedDB.

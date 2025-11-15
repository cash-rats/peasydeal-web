# IndexedDB-Only Cart Migration Plan

## Goals & Constraints

- **Goals**
  - Move the shopping cart for non-auth users to **IndexedDB-only** (no Redis-backed cart).
  - Keep the existing **pricing / promotion / tax logic on the server**, but have the server operate on a cart that the **client sends** when needed.
  - Allow the `/cart` page to be **client-render only** (no SSR of cart items or totals).
- **Constraints**
  - **No DB schema changes** (no new `carts` / `cart_items` tables for now).
  - Existing **payment / transaction** flow should still rely on server-side validation and `transaction.session`.
  - Minimize breaking changes to public URLs and overall UX (product pages, cart, checkout stay at the same paths).

## Target Architecture (High Level)

- **Source of truth for cart items**
  - The cart (items, quantities, variants) lives **only in the browser** in IndexedDB.
  - It is **per browser / per device**. There is no server-side persistent cart store.
- **Server responsibilities**
  - Compute **price information**, tax, discount, and promo code effects from a cart payload that the client submits.
  - Maintain **transaction/session state** that is needed for payment (e.g. `price_info` snapshot, selected promo code, etc.).
  - Handle checkout and payment using that snapshot; re-validate prices and availability.
- **Cart page rendering**
  - `/cart` route loader no longer reads the cart from Redis.
  - The cart UI is rendered **on the client only**:
    - On mount, the cart component loads the cart from IndexedDB.
    - Then it calls a **price API** to get `PriceInfo` and normalized server-calculated data.
  - From the perspective of Remix / React Router, the `/cart` loader might return just a minimal shell payload (or nothing) and the cart UI hydrates purely from client state.

## Current Implementation Overview

### Storage & Session

- Cart is stored in **Redis session**, via:
  - `~/sessions/shoppingcart.session.server` (`getCart`, `insertItem`, etc.).
  - `~/sessions/redis_session.server` for commit.
- Transaction-related data (price snapshot / promo) is stored in:
  - `~/sessions/transaction.session.server` (`setTransactionObject`, `resetTransactionObject`).

### `/cart` Route

- File: `app/routes/cart._index/route.tsx`.
- **Loader**
  - Calls `getCart(request)` to load the cart from Redis.
  - If no cart, throws `404` and resets the transaction.
  - Calls `fetchPriceInfo` with `convertShoppingCartToPriceQuery(cart)`.
  - Calls `setTransactionObject` with `price_info` and `promo_code`.
  - Returns cart + `priceInfo` in JSON with a committed session cookie.
- **Action**
  - Reads `__action` from `formData` and handles:
    - `remove_cart_item` → `removeCartItemAction`.
    - `update_item_quantity` → `updateItemQuantity`.
    - `apply_promo_code` → `applyPromoCode`.
    - `buy_now` → parses `cart_item`, calls `insertItem`, commits, and redirects to `/cart`.
  - Unknown actions throw.

### Product Route & Add to Cart

- File: `app/routes/product.$prodId/components/ProductActionBar/index.tsx`.
- `Add To Cart`:
  - Currently triggers a callback that eventually hits server cart logic via actions in `cart._index`.
- `Buy Now`:
  - Posts to `/cart?index` with:
    - `__action = 'buy_now'`.
    - `cart_item` as JSON (serialized).
  - The action writes to Redis cart and redirects.

## Target Data Flow (IndexedDB-Only)

### 1. Cart State Location & Shape

- **Cart shape**
  - Keep a similar structure to today’s cart items (product UUID, variation UUID, quantity, price fields, etc.), so we can still reuse:
    - `convertShoppingCartToPriceQuery`.
    - `fetchPriceInfo`.
  - We may need a small mapping layer to transform the IndexedDB format into whatever `convertShoppingCartToPriceQuery` expects.
- **Storage keying**
  - IndexedDB database name: e.g. `peasydeal_cart`.
  - Object store: `cart_items` (or a single `cart` object).
  - Key: a constant (e.g. `'default-cart'`) since we are not distinguishing users by ID for now.
  - This keeps the implementation simple and aligned with “guest-only cart”.

### 2. Cart Page (`/cart`) Behavior

- **Loader**
  - No longer calls `getCart(request)` or reads the cart from Redis.
  - Instead:
    - Either returns an empty JSON object (or minimal flags like feature config).
    - Or becomes a no-op loader where the main work happens in the component.
  - It may still handle resetting `transaction.session` when needed (e.g., if load fails or checkout finishes).
- **Component (`Cart`)**
  - On mount:
    1. Load the cart from IndexedDB via a client-only helper (e.g. `loadLocalCart()`).
    2. If the cart is empty, render `EmptyShoppingCart`.
    3. If the cart has items:
       - Call a **new API/endpoint** that accepts the cart payload and returns:
         - `priceInfo` (same type as today).
         - Optionally a normalized cart structure (e.g. updated prices or availability).
       - Store `priceInfo` in component state.
       - Optionally, the server can update `transaction.session` inside this API call.
  - For all cart mutations (quantity updates, remove, apply promo):
    - Update local React state.
    - Persist to IndexedDB.
    - Call the price API again to recalculate `priceInfo`.

### 3. Price Calculation Endpoint

- **New route (or reuse `cart._index` action with a new `__action`)**:
  - Input:
    - Cart payload from the client (e.g. `items[]`).
    - Optional `promo_code`.
  - Server logic:
    - Convert to the expected price query format using `convertShoppingCartToPriceQuery`.
    - Call `fetchPriceInfo`.
    - Potentially write to `transaction.session`:
      - `price_info`.
      - `promo_code`.
    - Return:
      - `priceInfo`.
      - Any necessary normalized cart representation (e.g. updated prices, filtered unavailable items).
  - Output:
    - JSON response consumed by the client-side cart component.
- **Usage**:
  - Invoked:
    - On initial cart load (if cart is non-empty).
    - On quantity updates, removal, and promo application.
    - Before checkout to ensure prices match the server’s view.

### 4. Product Page: Add to Cart & Buy Now

- **Add To Cart**
  - Behavior:
    - Update in-memory cart context/hook.
    - Persist the change to IndexedDB.
    - Optionally, trigger a background price API call just to keep client-side totals up to date.
  - No immediate server-side cart write; the cart lives in IndexedDB until a price or checkout call is made.
- **Buy Now**
  - Revised flow:
    1. When the user clicks `Buy Now`:
       - Ensure the selected item is added to the local IndexedDB cart (if not already).
       - Optionally tag the item as "selected for checkout" in local state.
    2. Redirect to `/cart` or directly to a checkout path where:
       - The client reads the cart from IndexedDB.
       - Calls the price API with the current cart.
       - Proceeds to the payment step after server confirmation.
  - The existing `__action='buy_now'` form posting to `/cart?index` will be refactored:
    - Instead of writing to a Redis cart, it will eventually be removed or replaced with a client-side handler plus a simple navigation.

### 5. Checkout & Transaction Session

- **Checkout flow**
  - Before initiating payment:
    - Client sends the **current cart** to a server endpoint dedicated to checkout preparation.
    - Server:
      - Calls `fetchPriceInfo` using the provided cart.
      - Validates items (availability, limits, etc.).
      - Writes `price_info` and any relevant promo data into `transaction.session`.
      - Returns a payload needed to render the checkout page.
  - The checkout route then:
    - Reads from `transaction.session` (unchanged approach).
    - Uses that snapshot as the authoritative basis for payment.
- **Key point**
  - Cart itself is not persisted on the server anymore; only the **snapshot** used for the current transaction is stored.

## Step-by-Step Implementation Plan

### Phase 1 – Prepare Server APIs & Isolate Cart Logic

1. **Introduce a price calculation endpoint**
   - Implement a new route (e.g. `app/routes/cart.price.tsx` or an action within `cart._index` keyed by a distinct `__action`).
   - This endpoint:
     - Accepts a cart payload (JSON or `FormData`).
     - Calls `convertShoppingCartToPriceQuery` and `fetchPriceInfo`.
     - Optionally updates `transaction.session`.
     - Returns `priceInfo` and any normalized cart data.
2. **Refactor existing cart logic for reuse**
   - Extract shared logic from the `/cart` loader into a helper (e.g. `cartPriceService`):
     - This keeps `fetchPriceInfo`, `convertShoppingCartToPriceQuery`, and `extractPriceInfoToStoreInSession` reusable.
   - Keep existing Redis-based cart loader/action working during this phase to avoid regressions.

### Phase 2 – Introduce Client-Side Cart Storage (IndexedDB) Without Behavior Change

3. **Add a client-only IndexedDB helper**
   - Create `app/lib/cartStorage.client.ts` (or similar) that provides:
     - `loadCart()`: read cart from IndexedDB.
     - `saveCart(cart)`: write entire cart.
     - Optional helpers for `addItem`, `updateQuantity`, `removeItem`.
   - Ensure it is only used in client-side code (no imports in loaders/actions).
4. **Create a cart state hook/context**
   - Implement `useLocalCart` (or reuse/extend `useCartState`) that:
     - Initializes from `loadCart()` on the client.
     - Exposes operations:
       - `addItem`, `updateQuantity`, `removeItem`, `applyPromo`.
       - Each operation updates React state and calls `saveCart`.
   - Initially, keep the server as the source of truth but start mirroring loader cart into IndexedDB for future migration.

### Phase 3 – Convert `/cart` to Client-Rendered Cart Using IndexedDB

5. **Change `/cart` loader to a shell-only loader**
   - Remove `getCart(request)` and any Redis cart usage from the loader.
   - Loader now:
     - Optionally resets `transaction.session` on specific conditions.
     - Returns only non-cart data (if any) needed for the cart page shell.
6. **Update `Cart` component to use IndexedDB + price API**
   - On mount:
     - Call `loadCart()` from IndexedDB.
     - If empty → render `EmptyShoppingCart`.
     - If not empty → call the price API to get `priceInfo`.
   - Wire actions (remove, quantity change, apply promo) to:
     - Update local state and IndexedDB.
     - Call price API to recompute `priceInfo`.
   - Remove dependencies on `useLoaderData` for cart data.
7. **Deprecate Redis cart usage in `/cart` action**
   - Replace:
     - `removeCartItemAction`, `updateItemQuantity`, `applyPromoCode` calls that mutate Redis cart.
   - With client-side equivalents:
     - Actions become thin wrappers (or are removed entirely in favor of pure client behavior + price API).
   - For backwards compatibility, you can temporarily keep the action to handle legacy forms while gradually moving everything to client.

### Phase 4 – Adjust Product Page (`ProductActionBar`) to Use IndexedDB Cart

8. **Refactor `Add To Cart`**
   - Replace the current server-tied behavior with:
     - `onClickAddToCart` calling into the new cart hook/context.
     - Cart state written directly into IndexedDB.
   - Provide immediate UX feedback (button loading state), but no immediate server write.
9. **Refactor `Buy Now`**
   - Instead of posting to `/cart?index` with `__action='buy_now'`:
     - Ensure that the selected item is present in the IndexedDB cart.
     - Navigate to `/cart` (or a dedicated checkout route).
     - The cart/checkout page will:
       - Load from IndexedDB.
       - Call the price API.
       - Then proceed to payment based on server-validated data.
   - Once this is stable, remove the Redis-specific `buy_now` logic from the `/cart` action.

### Phase 5 – Wire Checkout to Use Client Cart + Transaction Session

10. **Checkout preparation endpoint**
    - Implement or adapt an endpoint that:
      - Receives the current cart from the client.
      - Calls `fetchPriceInfo` (again) and validates.
      - Writes `price_info` and relevant data into `transaction.session`.
      - Returns a response used by the checkout route to start payment.
11. **Checkout route consumption**
    - Ensure the checkout route reads from `transaction.session` as today.
    - Enforce that checkout can only be started after this preparation step; i.e., clients should not skip straight to payment without sending the cart.

### Phase 6 – Cleanup & Hardening

12. **Remove Redis cart storage**
    - Delete or deprecate functions that read/write cart items from Redis sessions:
      - `getCart`, `insertItem`, and related helpers for cart storage specifically.
    - Keep `transaction.session` for transaction data only.
13. **Error handling & edge cases**
    - Handle IndexedDB unavailability or errors:
      - Fallback: treat as empty cart and show appropriate messaging.
    - Handle price API failures:
      - Show a user-friendly error and possibly block checkout until it succeeds.
14. **Testing**
    - Unit tests:
      - Cart state hook / context.
      - Price API endpoint logic (convert cart → price query → `fetchPriceInfo`).
    - Integration/E2E tests:
      - Add to cart from product page, refresh, cart persists.
      - Modify quantities, remove items, apply promo, prices update correctly.
      - Complete checkout path using IndexedDB-based cart.

## Open Questions / Decisions

- Do we want to support any **pre-login → post-login cart merge** in the future?
  - For now, the answer is effectively "no" since cart is browser-only.
- How aggressively should we **recalculate prices**?
  - On every small change (simpler, but more requests) vs. grouped changes (more complex, fewer requests).
- How much of the existing `/cart` action API needs to remain for **backwards compatibility**?
  - If we fully commit to client-side cart + price API, we can eventually remove most of the current cart actions and rely on a small set of API endpoints instead.

This plan keeps the cart entirely in IndexedDB for non-auth users, relies on the server only for price calculation and checkout validation, and avoids any DB schema changes while progressively dismantling the Redis-backed cart. The next step is to pick specific filenames/routes for the new price API and client utilities, then start implementing Phase 1. 


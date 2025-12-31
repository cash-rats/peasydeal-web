# `/cart` Page Redesign — Implementation Plan

Design source of truth: `redesigns/cart_page/screen.png` and `redesigns/cart_page/code.html`.

Constraints:
- Preserve all cart behavior (IndexedDB hydration, `/api/cart/price`, `/api/cart/checkout`, promo application, remove/update quantity).
- Prefer Tailwind + existing shadcn components; remove legacy CSS imports where possible.
- Ensure responsive parity: desktop 2-column + sticky sidebar, mobile stacked layout.

## 1) Audit + Baseline (no functional changes)
- Confirm current route composition:
  - Layout: `app/routes/cart/route.tsx` (wraps `CatalogLayout` + renders recommended products after outlet).
  - Page: `app/routes/cart._index/route.tsx` (cart UI + hydration + pricing/checkout fetchers).
- Identify styling dependencies to remove:
  - `app/routes/cart._index/route.tsx` imports `~/routes/cart/styles/cart.css?url` and `~/routes/cart/components/Item/styles/Item.css?url`.
  - `app/routes/cart/components/Item/index.tsx` imports `./styles/Item.css?url`.

## 2) Layout Skeleton (match the guide’s structure)
Target structure on `app/routes/cart._index/route.tsx`:
- Page container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10`.
- Header row:
  - Left: `Shopping Cart` + item count.
  - Right: “SSL SECURE CONNECTION” pill (use current `sslCheckout` or replace with icon + text; keep accessible alt text).
- Main grid (`lg:grid lg:grid-cols-12 lg:gap-8`):
  - Left list: `lg:col-span-8` with:
    - Column headers row visible on `md+` only: Item / Price / Quantity / Total.
    - Item cards list.
  - Right sidebar: `lg:col-span-4` with `sticky top-6`:
    - Promo card
    - Summary card
    - Payment methods section

Deliverable: layout matches proportions/spacing of `redesigns/cart_page/screen.png` before restyling item internals.

## 3) Cart Item Card Redesign
Update `app/routes/cart/components/Item/index.tsx` to match the guide:
- Card container: rounded, subtle border + shadow, hover shadow (desktop parity with mock).
- Internal grid:
  - `md:grid-cols-12` with spans matching mock:
    - Item details: `md:col-span-6` (image + title + variation + optional discount pill).
    - Price: `md:col-span-2` (strike-through retail, sale, optional “Final charge” line).
    - Quantity: `md:col-span-2` (centered control).
    - Total + remove: `md:col-span-2` (right aligned total + trash icon).
- Remove button:
  - Replace current absolute-position “Delete” pill with an icon button aligned to the far right (use existing `BsTrash`).
- Typography & truncation:
  - Clamp long titles (e.g., `line-clamp-2` if available) and keep variant text muted.

Goal: remove the need for `Item.css` entirely (no `links()` export from item component).

## 4) Quantity Control Styling
Keep behavior as-is (dropdown menu), but style it to match the mock:
- Use `app/components/QuantityDropDown/index.tsx` class overrides:
  - compact width (similar to `w-20`) and smaller padding.
  - ensure disabled styling is clear during `calculating`.

Optional follow-up (not required for this pass): swap to a stepper control (minus/plus) if desired.

## 5) Sidebar: Promo + Summary Cards
Refactor `app/routes/cart/components/PriceResult/index.tsx` into two visual cards (same logic):
- Promo card:
  - title row (ticket icon + “Promo Code (optional)”)
  - input + apply button inline on desktop, stacked on mobile
  - success state box (green) and error state box (pink/red)
- Summary card:
  - header “Summary”
  - rows: Items (VAT incl.), Promo code deal, Shipping cost
  - “applied_events” rendered as compact badges (match mock’s small chips)
  - discount rows in accent color
  - “Total to pay” emphasized
  - CTAs:
    - Primary: yellow “Continue to checkout” with lock/bag icon
    - Secondary: pink “Continue shopping”

Ensure `calculating` state keeps existing skeleton/spinner behavior.

## 6) Remove Legacy Stylesheet Imports
After Tailwind parity is reached:
- Delete `links()` in `app/routes/cart._index/route.tsx` (remove `cart.css?url` + `Item.css?url`).
- Remove `links()` in `app/routes/cart/components/Item/index.tsx`.
- Keep any remaining CSS only if strictly necessary; otherwise prefer Tailwind utilities.

## 7) Recommended Products Section
Decide whether the guide includes recommended products below the cart:
- Current behavior is in `app/routes/cart/route.tsx` after `<Outlet />`.
- If design requires it, keep unchanged; otherwise we can gate it behind a design decision (e.g., keep but restyle container spacing to match page background).

## 8) QA Checklist (must pass)
- Empty cart renders `EmptyShoppingCart` (no hydration flicker).
- Hydration + initial price fetch occurs once; totals update after responses.
- Update quantity:
  - UI disables while calculating, totals update, cart count stays correct.
- Remove item:
  - removes without crash; when last item removed, price info clears and empty state shows.
- Promo code:
  - apply success + error messages display; summary updates accordingly.
- Checkout:
  - button disabled while calculating; submit still posts to `/api/cart/checkout`.
- Responsive:
  - Desktop: 2 columns + sticky sidebar; header labels visible on md+.
  - Mobile: stacked cards; remove button accessible; no overflow issues.

## 9) Validation Commands
Run locally after implementation:
- `npm run lint`
- `npm run typecheck`


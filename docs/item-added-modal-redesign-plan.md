# ItemAddedModal Restyle Plan (Add-to-Cart Redesign)

## Goal
Restyle `app/components/PeasyDealMessageModal/ItemAddedModal.tsx` to match the reference in `redesigns/add_to_cart_redesign/` (layout, spacing, content sections, CTAs, close button, and optional blurred overlay).

## Current State
- `ItemAddedModal` renders a minimal success card (icon + headline) inside `app/components/PeasyDealMessageModal/index.tsx` (a thin wrapper over `~/components/SimpleModal`).
- Call site example: `app/routes/product.$prodId/route.tsx` uses `<ItemAddedModal open={openSuccessModal} />`.

## Scope Decisions (Confirm Before Implementing)
1. Data source:
   - A) Pass the “added item” summary (image/title/variant/price/qty) + `cartCount` as props to `ItemAddedModal`, or
   - B) Derive from existing cart state/store/hooks (if already available at call sites).
2. Dark mode:
   - A) Light-only match (recommended unless app already toggles `dark` class), or
   - B) Add dark styles as well.
3. Overlay blur:
   - A) Add optional blur support to `SimpleModal`, or
   - B) Keep dim overlay only (no blur) for minimal shared-component change.

## Implementation Steps
1. Audit existing modal usage
   - Find all `ItemAddedModal` call sites and determine what item/cart data is available at the moment the modal opens.
2. Define modal API
   - Add optional props for:
     - `item`: `{ imageUrl, title, variantText, priceText, quantity }` (exact shape TBD)
     - `cartCount?: number`
     - `onContinueShopping?: () => void`
     - `onViewCart?: () => void`
   - Keep `open` and `onClose` behavior backward compatible (modal should still render without item data).
3. Update modal layout to match reference
   - Header section: success icon in ring + “Added to Cart!” + subcopy.
   - Body section: product summary row (image + text + price + qty).
   - Actions section: secondary “Continue Shopping”, primary “View Cart (n) →”.
   - Footer note: “Free shipping on orders over $150” (or confirm copy).
   - Close button: top-right “X” inside the modal content (absolute positioned), independent of `SimpleModal` header rendering.
4. Address `SimpleModal` limitations (only if needed)
   - Optional: add `overlayClassName?: string` (or `backdropBlur?: boolean`) so overlay can use `backdrop-blur-sm` + appropriate background classes.
   - Keep defaults unchanged to avoid affecting other modals.
5. Wire call sites
   - Update `app/routes/product.$prodId/route.tsx` (and any other usages) to provide `onViewCart` navigation and `cartCount` if available.
   - Decide on navigation target for “View Cart” (existing route/path).
6. Storybook update
   - Update `app/components/PeasyDealMessageModal/PeasyDealMessageModal.stories.tsx` to demonstrate the redesigned modal with representative item data and `cartCount`.
7. Verify and polish
   - Run `npm run lint` and `npm run typecheck`.
   - Optional: add/adjust a small unit/component test if there’s an existing pattern for modal rendering assertions (otherwise rely on Storybook/manual QA).

## Acceptance Criteria
- Visual structure matches `redesigns/add_to_cart_redesign/screen.png`:
  - 3-part layout (header + product summary + CTAs) with close icon.
  - Primary/secondary buttons align and respond correctly on small screens.
- No regressions to other `SimpleModal` users (if `SimpleModal` is changed, defaults remain identical).
- Modal remains accessible:
  - `role="dialog"` + focus trapping already handled by `SimpleModal`.
  - Close button is keyboard accessible and has `aria-label`.

## Risks / Open Questions
- Where “added item” data lives at the time the modal opens (may require minor state plumbing).
- Whether cart count is readily available without additional fetching.
- Overlay blur requires a shared-component change unless we accept dim-only overlay.


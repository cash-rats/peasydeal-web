# Order Success Redesign Plan (Payment Success)

## Objective
Redesign the order success content rendered by `app/routes/payment.$orderId/components/Success/*` to match `redesigns/order_success_redesign` (content area + product/order details), while **ignoring navbar and footer redesign**.

## Scope (In / Out)
- In scope
  - Success hero (checkmark, headline, confirmation copy, CTAs).
  - Order details card (status pill, order number, date, payment method, totals).
  - Items list redesign (layout, spacing, typography, optional image placeholder).
  - Customer information card + “Need help?” support card.
  - Responsive layout: single column on mobile, 2-column grid on large screens.
- Out of scope
  - Global header/nav, category nav, benefit badges row, footer.
  - Backend/API changes unless explicitly approved (e.g., item images, real order status, shipping address fields).

## Current Implementation Summary
- `Success` fetches order details via `useFetcher()` POST to `/payment?index&order_uuid=${orderId}` and renders:
  - `OrderAnnotation` (success icon, copy, CTAs)
  - `OrderDetail` (order meta + totals)
  - `ProductSummary` (simple list)
  - `OrderInformation` (contact + billing address)
  - `LoadingSkeleton` while fetch is pending

## Redesign Reference (Content Area)
Target layout from `redesigns/order_success_redesign/code.html` and `redesigns/order_success_redesign/screen.png`:
- Centered hero (checkmark badge, headline, email confirmation line).
- Two CTAs: primary “Continue Shopping”, secondary “Track your order”.
- Two-column content region:
  - Left: “Order Details” card including order meta + “Items in your order” list + totals.
  - Right: “Customer Information” card with contact + billing/shipping blocks, plus a “Need Help?” card.

## Data Mapping (What We Have vs Need)
Available via `SuccessOrderDetail` (`app/routes/payment/types.ts`):
- Hero: `email`, `order_uuid`
- Order meta: `order_uuid`, `created_at`
- Totals: `subtotal`, `tax`, `shipping_fee`, `total`
- Items: `order_items[]` with `title`, `spec_name`, `order_quantity`, `sale_price`
- Customer info: `email`, `phone`, `first_name`, `last_name`, address fields

Missing vs redesign (requires decision):
- Item thumbnail image URL: not present in `OrderItem`.
  - Option A (recommended): display a consistent placeholder thumbnail block.
  - Option B: add backend/API enrichment to include image URL per order item.
- Order status: redesign shows “Confirmed”, but no status field in response.
  - Option A: hardcode “Confirmed”.
  - Option B: extend API to return real status.
- Payment method: redesign shows credit card; current UI hardcodes “Credit Card” in `OrderDetail`.
  - Option A: display `paymentMethod` prop (normalized string).
  - Option B: keep “Credit Card” if that’s always true for this route.
- Shipping address block: redesign includes “Same as billing address”.
  - Option A: display “Same as billing address” (since shipping fields aren’t present).
  - Option B: add shipping fields to API and render separately.

## Implementation Strategy
### Layout & Composition
Refactor the success content to mirror the redesign’s structure:
- Outer page background: light gray surface, centered container, comfortable vertical spacing.
- Hero section: centered, max width, with two CTAs.
- Content grid: `grid grid-cols-1 lg:grid-cols-3 gap-6` (or similar)
  - Left column: `lg:col-span-2` card for order details + items + totals.
  - Right column: `lg:col-span-1` card for customer info + help card.

### Component Plan (Minimal Churn)
Prefer updating existing components to reduce risk:
- `app/routes/payment.$orderId/components/Success/index.tsx`
  - Keep data fetching + GTM tracking intact.
  - Replace the current stacked layout with hero + grid region.
- `.../components/OrderAnnotation/index.tsx`
  - Redesign hero visuals and copy to match mock.
  - Ensure CTAs match the new button style and text (“Track your order”).
- `.../components/OrderDetail/index.tsx`
  - Convert to a card header with title + status pill.
  - Render order meta in a 3-column row on md+ (order number, date, payment method).
  - Move totals section to bottom of the same card (match redesign).
  - Ensure currency formatting matches existing conventions (currently uses `$` but tracking says GBP).
- `.../components/ProductSummary/index.tsx`
  - Convert to “Items in your order” list inside the order details card.
  - Add structured item rows (thumbnail placeholder, title, spec name, qty, price).
  - Keep the data footprint identical unless image URLs become available.
- `.../components/OrderInformation/index.tsx`
  - Convert to “Customer Information” card.
  - Break out blocks: Contact, Billing Address, Shipping Address (placeholder “Same as billing address” if needed).
- `app/routes/payment.$orderId/components/LoadingSkeleton/index.tsx`
  - Update skeleton layout to resemble hero + 2-column card layout so loading doesn’t jump.

### Styling & UI Primitives
- Use Tailwind utilities consistent with the codebase.
- Continue using existing UI primitives where they exist (`~/components/ui/button`, `~/components/ui/separator`, `~/components/ui/skeleton`).
- Ensure consistent typography (existing code references `font-poppins`; redesign uses Inter, but this task should follow app styling unless instructed otherwise).

## Step-by-Step Tasks
1. Confirm product thumbnail approach (placeholder vs API-backed image URL).
2. Confirm order status approach (“Confirmed” hardcode vs API).
3. Update `Success` layout to: hero section + responsive grid container.
4. Redesign `OrderAnnotation` to match the success hero design.
5. Merge `OrderDetail` + `ProductSummary` into a cohesive “Order Details” card layout (either via composition or by making `ProductSummary` render a section compatible with the card).
6. Redesign `OrderInformation` into a right-column card + add “Need Help?” card content (static link/action target to be confirmed).
7. Update `LoadingSkeleton` to match new layout proportions.
8. Validate responsive behavior (mobile → desktop), and confirm no regressions in:
   - Fetching logic
   - Tracking event (`pd_purchase`)
   - Routing for CTAs
9. Run `npm run lint` and `npm run typecheck` (and `npm run test` if desired) to ensure clean CI.

## Acceptance Criteria
- Matches the redesign’s content hierarchy and spacing (excluding global navbar/footer).
- Left/right two-column layout on large screens; single column on small screens.
- Items list shows title/spec/qty/price and a thumbnail placeholder if no image is available.
- Totals section includes subtotal (VAT incl), shipping fee, total.
- Customer information card is clear and readable; shipping address behavior matches the chosen approach.
- No changes to data fetching endpoint/contract unless explicitly approved.

## Risks / Open Questions
- Currency symbol: current UI uses `$` but GTM reports `currency: "GBP"`. Confirm desired display (e.g., `£`).
- “Need Help?” link destination: confirm whether it should route internally or link to an external support page.


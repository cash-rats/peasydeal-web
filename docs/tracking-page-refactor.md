# Tracking Page Refactor Plan

## Goal
Rebuild `/tracking` to match the `redesigns/elegant_order_tracking_page/code.html` layout: pill search bar, order header card (ID + dates), stacked item cards with thumbs/price/qty/status, delivery and order summary cards side by side, and a right-aligned primary “Cancel Order” button. Maintain existing data flow and SEO/error behavior.

## Scope and Targets
- `app/routes/tracking/route.tsx`: ensure wrapper markup supports new layout containers if needed.
- `app/routes/tracking/components/TrackingSearchBar`: restyle to pill input + primary search button.
- `app/routes/tracking/components/TrackingOrderInfo`: reorganize content into header card, item list cards, delivery info card, summary card, and cancel CTA with responsive spacing.
- Shared styles: keep Tailwind utility approach; no global theme changes expected.

## Step-by-Step Plan
1) **Audit data shapes**: Reconfirm `TrackOrder` fields used for order ID, dates, items, shipping/vendor/tracking numbers, delivery info, and totals to map cleanly into the new layout.
2) **Refactor search bar**: Update `TrackingSearchBar` JSX and classes to the pill input/button layout, preserving submit/clear behavior and accessibility.
3) **Restructure order info**: In `TrackingOrderInfo`, build the card stack:
   - Header card with order ID, order date, estimated delivery badges.
   - Item list cards with image, title/variant, vendor/tracking or status, and price/qty.
   - Delivery info card and order summary card in a responsive grid (single column on mobile, two columns on larger screens).
   - Right-aligned primary “Cancel Order” button.
4) **Spacing and responsiveness**: Apply responsive paddings/gaps (`p-4 sm:p-6`, `grid-cols-1 lg:grid-cols-2`, `sm:flex-row` etc.) to mirror the reference for desktop/tablet/mobile.
5) **Polish and a11y**: Ensure headings hierarchy, readable contrast, focus styles on buttons/inputs, and semantic sections.
6) **Test pass**: Manually check `/tracking?query=...` for populated order, empty state, and error boundary; run `npm run lint` if time permits.

## Risks and Mitigations
- **Data mismatch**: If some fields (e.g., vendor/tracking) are optional, guard rendering and provide fallbacks.
- **Long text overflow**: Use responsive wrapping and truncation for titles/addresses.
- **Mobile space**: Verify padding/margins on small screens to avoid cramped UI.

## Out of Scope
- Backend changes, new assets, or altering loader/action/SEO logic.

# Checkout Route – RR7 & UI Migration Plan

## Goals

- Migrate the checkout route to the React Router 7 file/route conventions.
- Remove MUI/Chakra usage from the checkout flow, replacing them with shadcn/Radix primitives while preserving behavior and layout.

---

## Stage 1 – Route Migration to React Router 7 Conventions

### 1.1 Confirm desired route structure

- Align checkout route structure with the existing RR7 patterns used in `cart`:
  - Use folder-based routes rather than standalone `checkout.tsx`.
  - Split layout vs. page responsibilities using `route.tsx` and `_index/route.tsx` as needed.
- Target structure:
  - `app/routes/checkout/route.tsx`
    - Loader/meta/links/shouldRevalidate for `/checkout`.
    - Stripe `Elements` and PayPal `PayPalScriptProvider` setup.
    - Layout shell (header, footer, `<Outlet />`) and `useContext` helper.
  - `app/routes/checkout._index/route.tsx`
    - Page-level loader/action for cart validation and order creation.
    - Checkout UI (shipping, contact info, payment form) using existing components.

### 1.2 Move `checkout.tsx` into folder-based layout

- Take the current `app/routes/checkout.tsx` and:
  - Copy its content into `app/routes/checkout/route.tsx`.
  - Update imports to account for the new relative path.
  - Ensure `useContext` continues to be exported from `~/routes/checkout/route` and uses `useOutletContext`.
- Verify:
  - The loader still redirects to `/cart` when transaction/cart is missing.
  - Stripe payment intent is created and `client_secret` is passed into `Elements`.
  - PayPal provider is still configured with env vars from `envs`.

### 1.3 Rename `checkout/index.tsx` to RR7 index route

- Rename `app/routes/checkout/index.tsx` → `app/routes/checkout._index/route.tsx`.
- Update imports that reference:
  - `import { useContext } from '~/routes/checkout';`
  - Any other direct imports from `~/routes/checkout/index`.
- Confirm:
  - The loader for `checkout._index` still validates the cart and redirects to `/cart` if empty.
  - The `action` still orchestrates PayPal/Stripe order creation using `__paypalCreateOrder`, `__paypalCapturePayment`, and `__stripeCreateOrder`.
  - `useContext` still provides `paymentIntendID`, `priceInfo`, and `promoCode` to the page.

### 1.4 Remove legacy/duplicate route file

- Once `/checkout` works with the new folder-based structure:
  - Delete or fully disable the legacy `app/routes/checkout.tsx` to avoid route duplication.
  - Ensure there is only one definition for the `/checkout` path, matching the pattern used for `cart`.
- Validation:
  - Start dev server (`npm run dev`) and confirm `/checkout`:
    - Renders the expected layout and page contents.
    - Still requires a non-empty cart and transaction to proceed (redirects otherwise).
  - Run `npm run typecheck` to ensure route-id collisions involving `checkout` are resolved.

---

## Stage 2 – Replace MUI/Chakra with shadcn/Radix in Checkout

### 2.1 Inventory legacy UI usage in checkout

- `app/routes/checkout._index/route.tsx` (currently `index.tsx`):
  - MUI: `Alert` from `@mui/material/Alert`.
  - Chakra: `Spinner` from `@chakra-ui/react`.
- `app/routes/checkout/components/ShippingDetailForm/index.tsx`:
  - MUI: `TextField`, `Tooltip`, `QuestionMarkIcon`.
  - Chakra: `Button`.
- `app/routes/checkout/components/CartSummary/index.tsx`:
  - Chakra: `Button`.
- `app/routes/checkout/components/CheckoutForm/components/StripeCheckout.tsx`:
  - MUI: `Divider`, `LoadingButton`, `LockIcon`.
- `app/routes/checkout/components/ContactInfoForm/index.tsx`:
  - MUI: `Checkbox`, `TextField`, `HelpIcon`.

Group these into refactorable chunks:

- Alerts and global feedback (Alert + Spinner).
- Form fields and labels (TextField, Checkbox, Tooltip/icons).
- Buttons/CTAs and loading states (Chakra Button, MUI LoadingButton).
- Payment method section (Stripe checkout area styling and icons).

### 2.2 Introduce or extend shadcn/Radix primitives for checkout

- Reuse existing primitives:
  - `app/components/ui/button.tsx`
  - `app/components/ui/input.tsx`
  - `app/components/ui/dropdown-menu.tsx`
- Add or extend primitives as needed:
  - `Alert` component compatible with current alert usage (severity="warning").
  - `Checkbox` and label pair, following shadcn patterns.
  - `Tooltip` using Radix Tooltip, styled to match current hints.
  - Simple `Spinner`/loading indicator, either as a shadcn-compatible component or a lightweight inline implementation.
  - Loading-capable button variant (e.g., `Button` with `isLoading` / `loading` props).
- For icons:
  - Replace MUI icons (`QuestionMarkIcon`, `HelpIcon`, `LockIcon`) with icons from `react-icons` or the existing icon set used in the project.

### 2.3 Refactor checkout components to use new primitives

- In `checkout._index/route.tsx`:
  - Replace `Alert` (MUI) with shadcn `Alert` or a small local wrapper.
  - Replace Chakra `Spinner` with a new spinner primitive or a minimal CSS-based spinner.
  - Keep error handling (scroll to top on error) unchanged.
- In `ShippingDetailForm`:
  - Swap MUI `TextField` to shadcn `Input` + label/error messaging using Tailwind.
  - Replace MUI `Tooltip` + `QuestionMarkIcon` with a Radix Tooltip + an icon button or inline icon.
  - Replace Chakra `Button` with shadcn `Button` (matching current size/variant).
- In `CartSummary`:
  - Replace Chakra `Button` with shadcn `Button`; keep existing layout and classes.
- In `ContactInfoForm`:
  - Replace MUI `Checkbox` with shadcn `Checkbox` + label component.
  - Replace MUI `TextField` and `HelpIcon` similarly to `ShippingDetailForm`.
- In `StripeCheckout`:
  - Replace `Divider` with a simple Tailwind-styled separator.
  - Replace `LoadingButton` with shadcn `Button` and an explicit loading state (e.g., spinner + disabled).
  - Replace `LockIcon` with a react-icons lock and preserve the “secure payment” messaging.
- Throughout:
  - Preserve existing CSS classes and layout from `Checkout.css` to minimize visual regressions.
  - Keep validation messages and aria attributes aligned with current behavior.

### 2.4 Remove MUI/Chakra imports from checkout

- After refactors:
  - Remove all `@mui/*` and `@chakra-ui/react` imports from `app/routes/checkout/**`.
  - If checkout was the last usage for any specific MUI/Chakra package, note that for a separate `package.json` cleanup task.

---

## Stage 3 – Validation & Polish

### 3.1 Type and behavior validation

- Run:
  - `npm run typecheck` to verify route structure and types.
  - `npm run dev` to manually test:
    - `/checkout` redirect behavior when cart/transaction is missing.
    - Shipping/contact form validation flows (including phone field).
    - Order creation and Stripe `stripeConfirmPayment` integration.
    - Error states (checkout creation error, Stripe error) showing new alert UI.

### 3.2 Visual QA

- Compare old vs new checkout UI (using stories or screenshots if available):
  - Layout of shipping, contact, and payment sections.
  - Button styles (primary vs secondary).
  - Alert appearance and placement.
  - Loading states and spinners.
- Adjust shadcn variants, sizes, and spacing to better match existing styles where necessary.

### 3.3 Documentation & cleanup

- Update `docs/chakra-migration-plan.md`:
  - Mark the checkout route and its components as migrated off Chakra/MUI.
  - Note any follow-up work required (e.g., further UI polish, package cleanup).
- If other routes are still using MUI/Chakra, add them to the shared migration punch list for future tasks.


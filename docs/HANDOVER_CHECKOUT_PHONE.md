# Checkout Phone Field Handover

## Context
- Branch: `redesign/main-rebased`
- Scope: checkout v2 (`app/routes/checkout._index/route.tsx` + `app/components/v2/*`)
- Current status: phone flow has been migrated from simple tel input to country-aware input, but visual polish on the phone country selector area may still need adjustment.

## Latest Commit
- `3aed9cd0` `Update checkout phone field with country selector and validation`
- Files included in this commit:
  - `app/components/v2/CheckoutInput/CheckoutInput.tsx`
  - `app/components/v2/ShippingAddressSection/ShippingAddressSection.tsx`
  - `app/routes/checkout._index/route.tsx`
  - `app/routes/checkout/utils.ts`

## Working Tree Notes
- Untracked directory: `staging-worktree/` (intentional local worktree folder; do not commit)
- This handover file (`docs/HANDOVER_CHECKOUT_PHONE.md`) is updated after the commit above.

## What Was Implemented

### 1. Phone UI migrated to country-aware input
- Replaced v2 phone `CheckoutInput` with `react-phone-input-2` in `ShippingAddressSection`.
- Added country code selector + searchable country list.
- Disabled library default floating label (`specialLabel=""`) to avoid duplicate label overlap with custom PRD-style label.
- Kept PRD-style phone label + info icon (`FiHelpCircle`) next to label text.

### 2. Dummy checks wired to current v2 submit path
- Added `formRef` + `validateFormBeforePayment` in `checkout._index/route.tsx`.
- `handleConfirmPayment` now blocks checkout when `validatePhoneInput` fails.
- This covers the v2 path where `Pay now` uses a button callback (not only native form submit).

### 3. Phone validation helper strengthened
- `validatePhoneInput` now:
  - requires non-empty phone,
  - normalizes common formatting chars (`space`, `(`, `)`, `-`),
  - enforces numeric content with optional leading `+`,
  - keeps minimum length check (`> 3`).

### 4. State/data flow updated for country data
- `ShippingAddressSection` `onChange` now supports metadata: `countryData`.
- `checkout._index/route.tsx` `handleShippingChange` now stores both:
  - `contactInfoForm.phone_value`
  - `contactInfoForm.country_data` (when provided by phone component)
- `phoneCountryCode` is passed back into `ShippingAddressSection` so selector can restore chosen country.

### 5. Input ergonomics
- Keydown filtering added for phone input to block non-numeric typing (except control keys and leading `+`).
- `CheckoutInput` was extended (`id`, `name`, `required`, `labelIcon`) and clears custom validity on change.

## Current Known Gaps / Risks
- Visual polish still needed around phone country selector area:
  - border visibility/consistency for left selector + combined input,
  - possible text overlap perception near selector depending on CSS stacking/theme.
- `shippingAddress.country` in `checkout._index/route.tsx` is still hardcoded to `'GB'` (pre-existing behavior). This may cause mismatch between displayed shipping country behavior and user expectation if multi-country behavior is expanded.

## Files To Continue Editing
- `app/components/v2/ShippingAddressSection/ShippingAddressSection.tsx`
- `app/routes/checkout._index/route.tsx`
- (if needed) `app/components/v2/CheckoutInput/CheckoutInput.tsx`

## Suggested Next Steps
1. Fine-tune phone selector visual layer
- Verify final DOM/CSS with browser DevTools and normalize borders/radius across:
  - `.flag-dropdown`
  - `.selected-flag`
  - `.form-control`
- If inline style is still overridden by library CSS, add a scoped class + explicit CSS override in app styles.

2. Re-check phone UX requirements
- Confirm if blocking invalid characters at keydown level is sufficient, or if paste sanitization should also be enforced.

3. Country consistency (optional, but recommended)
- Decide whether `ShippingAddress.country` should remain fixed `'GB'` or be made state-driven for parity with the selector UX.

## Validation Commands Used
- `npx eslint app/components/v2/ShippingAddressSection/ShippingAddressSection.tsx app/routes/checkout._index/route.tsx app/routes/checkout/utils.ts app/components/v2/CheckoutInput/CheckoutInput.tsx`
- Full `npm run typecheck` is currently noisy due to many unrelated repo errors (including `staging-worktree`), so use targeted lint/type checks while iterating on UI.

## Guardrails
- Keep changes scoped to checkout v2 path unless explicitly requested.
- Do not commit `staging-worktree/`.

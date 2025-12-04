# Checkout Code Quality Notes

Low-effort, maintenance-focused cleanups for the checkout flow (mark as done when completed):

- [x] **Order UUID handling**: `route.tsx` branches on `state.orderUUID`, but only `useCreateOrder` tracks the UUID. Either persist the UUID into reducer state or remove the unused branch to avoid dead code and confusion.
- [x] **Form state updates**: `handleFormChange` only updates shipping fields while contact updates happen via `ContactInfoForm` callbacks. Add a brief note or consolidate state updates so the split responsibility is explicit.
- [x] **Phone validation**: Move `validatePhone` into a small helper (e.g., `routes/checkout/utils.ts`) to declutter the component and enable reuse/tests.
- [x] **Action payload parsing**: Centralize JSON parsing for forms/promo codes in helpers to avoid repeated try/catch blocks and keep action handlers linear.
- [ ] **Fetcher typing & errors**: In `useCreateOrder`, type the fetcher data and guard missing `order_uuid`/non-200 responses to surface clearer errors instead of generic messages.
- [ ] **Stripe error handling**: In `useStripeConfirmPayment`, avoid double-wrapping errors and log unexpected cases (even `console.warn`) so failures aren’t silent.
- [ ] **Debug/quirk cleanup**: Remove the stray `console.log` in `CheckoutForm` and clarify the “skip 2 onChange” behavior around `PaymentElement` selection, or simplify if possible.
- [ ] **Props typing**: Narrow `StripeCheckout` handler prop types (avoid `any`) to catch misuse and document expected return shapes.
- [ ] **Effect intent**: The contact/shipping name sync effect in `route.tsx` isn’t obvious; a short comment or helper would make the intent clear without changing behavior.

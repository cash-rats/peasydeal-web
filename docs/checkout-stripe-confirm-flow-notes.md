# Checkout Stripe Confirm Flow

- **Entry point**: `app/routes/checkout/components/CheckoutForm/components/StripeCheckout.tsx` renders `PaymentElement` plus a submit `Button`. The button text toggles to "Processing..." when `loading` is true and is disabled if `loading` or `disabled`.
- **Form submission**: The button lives inside the parent `createOrderFetcher.Form` from `app/routes/checkout._index/route.tsx`, so clicking it submits that form.
- **Pre-submit checks**: `handleSubmit` in `route.tsx` prevents default, validates the phone input (numeric, min length), then branches:
  - If `state.orderUUID` is empty (current behavior), it calls `handleCreateOrder('stripe')`.
  - Otherwise, it would call `stripeConfirmPayment` directly with the existing UUID.
- **Order creation**: `handleCreateOrder` composes payload (`shipping_form`, `contact_info_form`, `price_info`, `cart_items`, `payment_secret`, `promo_code`, `payment_method`) from reducer state + loader data, dispatches contact info update, and submits via `useCreateOrder` fetcher to the route `action` at `/checkout?index`.
- **Server action**: The route `action` routes Stripe submissions (no `action_type`) to `__stripeCreateOrder` (`app/routes/checkout/actions.ts`), which parses payloads and POSTs to the backend `/v2/orders` (`createOrder` in `app/routes/checkout/api.server.ts`). Response JSON is returned to the fetcher; errors set an `error` field.
- **Fetcher handling**: `useCreateOrder` watches the fetcher; on completion:
  - If `data.error` exists, sets `errorAlert` (shown in `route.tsx`).
  - Otherwise stores `orderUUID` from the response.
- **Payment confirmation**: `route.tsx` `useEffect` reacts when the fetcher is idle and `orderUUID` exists, then calls `stripeConfirmPayment(orderUUID)` from `useStripeConfirmPayment`.
- **Stripe confirm**: `useStripeConfirmPayment` wraps `stripe.confirmPayment` with the mounted `elements`; `return_url` is `${getBrowserDomainUrl()}/payment/${orderUUID}?payment_method=stripe`. It toggles `isPaying` (drives button "Processing...") and reports Stripe errors through `errorAlert`.
- **Method selection**: `CheckoutForm` keeps `selectedMethod` in sync with the Stripe `PaymentElement` accordion. When Stripe is selected, the confirm button stays enabled; PayPal UI is currently commented out.

# Checkout “CONFIRM” Flow (Stripe)

- **Start**: User clicks `CONFIRM` in `app/routes/checkout/components/CheckoutForm/components/StripeCheckout.tsx`. Button submits the parent `createOrderFetcher.Form`.
- **Client submit handler** (`app/routes/checkout._index/route.tsx`):
  - `handleSubmit` prevents default, runs `validatePhone` (strips spaces, allows an optional leading `+`).
  - If valid, `handleCreateOrder` builds the payload (shipping/contact info, cart, price info, Stripe payment intent id, promo code, `payment_method=stripe`) and calls `useCreateOrder`.
- **useCreateOrder** (`app/routes/checkout/hooks/use-create-order.tsx`):
  - Submits a POST via fetcher to `/checkout?index`.
  - On completion: if error → `errorAlert`; else sets `orderUUID`.
- **Route action** (`app/routes/checkout._index/route.tsx` → `__stripeCreateOrder` in `app/routes/checkout/actions.ts`):
  - Posts to backend `/v2/orders` (`app/routes/checkout/api.server.ts`) to create a PeasyDeal order.
  - Returns the backend JSON to the fetcher (status preserved).
- **Post-order effect** (`CheckoutPage` in `app/routes/checkout._index/route.tsx`):
  - `useEffect` watches `isDone && orderUUID` and invokes `stripeConfirmPayment(orderUUID)`.
- **Stripe confirmation** (`app/routes/checkout/hooks/use-stripe-confirm-payment.tsx`):
  - Calls `stripe.confirmPayment` with Elements; `return_url` = `/payment/{orderUUID}?payment_method=stripe`.
  - Stripe handles redirect/next steps; errors set `stripeErrorAlert`.
- **User feedback**:
  - Submit button shows “Processing…” and disables during work.
  - Spinner appears while the create-order fetcher is busy.
  - Errors render via `<Alert>` in the checkout page.

Text flow diagram:
`CONFIRM click → form submit → validate phone → build payload → fetcher POST /checkout?index → route action → backend /v2/orders → fetcher done (error? show alert : set orderUUID) → stripeConfirmPayment(orderUUID) → Stripe confirmPayment (redirect to /payment/{orderUUID}?payment_method=stripe)`.

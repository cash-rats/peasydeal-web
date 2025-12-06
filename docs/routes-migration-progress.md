# Routes Migration Progress

Track movement of routes from `routes.bk/` back into `app/routes/`. Update each entry once its corresponding route is copied and verified on Vercel.

## Checklist
- [x] `$.tsx`
- [x] `_index`
- [x] `__index/about-us.tsx`
- [x] `__index/contact-us.tsx`
- [x] `__index/payment-policy.tsx`
- [x] `__index/privacy.tsx`
- [x] `__index/return-policy.tsx`
- [x] `__index/sell-on-peasydeal.tsx`
- [x] `__index/shipping-policy.tsx`
- [x] `__index/terms-of-use.tsx`
- [x] `api.product.review`
- [x] `api.tracking.order-info`
- [ ] `blog`
- [ ] `blog._index`
- [x] `cart`
- [ ] `cart._index`
- [x] `cart.checkout.tsx`
- [x] `cart.components.horizontal-products.tsx`
- [x] `cart.price.tsx`
- [x] `checkout`
- [x] `checkout._index`
- [x] `checkout.fetch-address-options-by-postal`
- [x] `collection`
- [x] `collection.$collection`
- [x] `components`
- [ ] `confirm-subscription`
- [ ] `confirm-subscription.tsx`
- [ ] `healthcheck.tsx`
- [ ] `hooks`
- [x] `payment`
- [x] `payment.tsx`
- [x] `product`
- [x] `product.$prodId`
- [x] `product.components.recommended-products.ts`
- [x] `promotion`
- [x] `promotion.$promotion`
- [x] `remix-image`
- [x] `search`
- [x] `styles`
- [ ] `subscribe`
- [x] `tracking`
- [ ] `unsubscribe`

## Findings
- Payment routes migrated but still rely on MUI components; rewrite each to shadcn/radix:
  - [x] `app/routes/payment.$orderId/components/Failed/index.tsx` (swapped to shadcn Button + lucide icon)
  - [x] `app/routes/payment.$orderId/components/LoadingSkeleton/index.tsx` (swapped to shadcn Skeleton)
  - [x] `app/routes/payment.$orderId/components/Success/components/OrderAnnotation/index.tsx` (swapped to shadcn Button + lucide icon)
  - [x] `app/routes/payment.$orderId/components/Success/components/OrderDetail/index.tsx` (swapped to shadcn Separator)
  - [x] `app/routes/payment.$orderId/components/Success/components/ProductSummary/index.tsx` (swapped to shadcn Separator)
- Tracking review modal components migrated off Chakra to shadcn primitives.
- Core dependencies blocking ESM migration for `app/routes/$.tsx` live inside `Header` and `Footer`:
  - `app/components/Header/components/AnnouncementBanner/index.tsx` uses `@mui/material/IconButton`.
  - `app/components/Footer/components/ProductsSection/index.tsx` uses `@mui/material/Button`.
  - `app/components/Footer/components/FooterContent/index.tsx` uses `@mui/material/TextField` and `@mui/icons-material/Email`.
  - `app/components/Footer/components/EmailSubscribe/index.tsx` renders `EmailSubscribeModal`, which in turn depends on `@chakra-ui/react`.
  - The Chakra modal itself is defined in `app/components/EmailSubscribeModal/index.tsx`.

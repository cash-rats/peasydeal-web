# Routes Migration Progress

Track movement of routes from `routes.bk/` back into `app/routes/`. Update each entry once its corresponding route is copied and verified on Vercel.

## Checklist
- [x] `$.tsx`
- [x] `_index`
- [x] `api.product.review`
- [x] `api.tracking.order-info`
- [ ] `blog`
- [ ] `blog._index`
- [ ] `cart`
- [ ] `cart._index`
- [ ] `cart.checkout.tsx`
- [ ] `cart.components.horizontal-products.tsx`
- [ ] `cart.price.tsx`
- [ ] `checkout`
- [ ] `checkout._index`
- [ ] `checkout.fetch-address-options-by-postal`
- [ ] `collection`
- [ ] `collection.$collection`
- [ ] `components`
- [ ] `confirm-subscription`
- [ ] `confirm-subscription.tsx`
- [ ] `healthcheck.tsx`
- [ ] `hooks`
- [ ] `payment`
- [ ] `payment.tsx`
- [x] `product`
- [x] `product.$prodId`
- [ ] `product.components.recommended-products.ts`
- [ ] `promotion`
- [ ] `promotion.$promotion`
- [x] `remix-image`
- [ ] `search`
- [ ] `styles`
- [ ] `subscribe`
- [ ] `tracking`
- [ ] `unsubscribe`

## Findings
- Core dependencies blocking ESM migration for `app/routes/$.tsx` live inside `Header` and `Footer`:
  - `app/components/Header/components/AnnouncementBanner/index.tsx` uses `@mui/material/IconButton`.
  - `app/components/Footer/components/ProductsSection/index.tsx` uses `@mui/material/Button`.
  - `app/components/Footer/components/FooterContent/index.tsx` uses `@mui/material/TextField` and `@mui/icons-material/Email`.
  - `app/components/Footer/components/EmailSubscribe/index.tsx` renders `EmailSubscribeModal`, which in turn depends on `@chakra-ui/react`.
  - The Chakra modal itself is defined in `app/components/EmailSubscribeModal/index.tsx`.

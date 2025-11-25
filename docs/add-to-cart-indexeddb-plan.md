# Add to Cart IndexedDB Cleanup Plan

1) **Remove server POST**: Update `app/routes/product.$prodId/hooks/useAddToCart.ts` to drop the fetcher submission to `/product/{productUUID}` and any reliance on the fetcher state/type for loading or success handling. Keep building the `ShoppingCartItem`, updating the cart context (which persists to IndexedDB), and firing analytics.

2) **Local loading + success UX**: Replace fetcher-driven flags with local state to keep the "Adding" spinner and to open/auto-close `ItemAddedModal` after a successful local add. Ensure the hook continues to expose `isAddingToCart` and modal controls for the container.

3) **Remove unused route action**: In `app/routes/product.$prodId/route.tsx`, delete the `add_item_to_cart` action branch and related imports (`commitSession`, `insertItem`, `ShoppingCartItem`). Keep only `to_product_detail` handling and a safe fallback for unknown actions.

4) **Verify/cart context consumers**: Confirm `ProductActionBar`/`ProductDetailContainer` props (`loading`, `onClickAddToCart`) still use the hook’s local loading flag and modal after the refactor. No server interaction should remain in the add-to-cart path.

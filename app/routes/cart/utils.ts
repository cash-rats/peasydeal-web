import type { ShoppingCart, ShoppingCartItem } from '~/sessions/shoppingcart.session';
import type { PurchasedProduct } from './cart.server';


export const syncShoppingCartWithNewProductsInfo = (
  cart: ShoppingCart,
  purchasedProds: PurchasedProduct[],
): ShoppingCart => {
  let updatedCartItems = new Map<string, ShoppingCartItem>();

  for (const prod of purchasedProds) {
    if (
      prod?.variation_uuid &&
      cart[prod.variation_uuid]
    ) {
      updatedCartItems.set(
        prod.variation_uuid,
        {
          ...cart[prod.variation_uuid],
          discountReason: prod.discount_reason,
          retailPrice: prod.origin_unit_price.toString(),
          salePrice: prod.discounted_price.toString(),
          quantity: String(prod.quantity),
        },
      );
    }
  }

  return Object.fromEntries(updatedCartItems);
}
import type { ShoppingCart, ShoppingCartItem } from '~/sessions/types';

import type { PurchasedProduct, PriceInfo } from './types'

/**
 * Transform newly added product to `ShoppingCartItem` so it can be
 * add to Shopping cart.
 */
export const syncShoppingCartWithNewProductsInfo = (
  cart: ShoppingCart,
  purchasedProds: PurchasedProduct[],
): ShoppingCart => {
  let updatedCartItems = new Map<string, ShoppingCartItem>();

  for (const prod of purchasedProds) {
    const itemInCart = cart[prod.variation_uuid];

    if (
      prod?.variation_uuid &&
      itemInCart
    ) {
      updatedCartItems.set(
        prod.variation_uuid,
        {
          ...cart[prod.variation_uuid],
          discountReason: prod.discount_reason,

          retailPrice: itemInCart.retailPrice.toString(),

          salePrice: prod.origin_unit_price.toString(),
          quantity: String(prod.quantity),
        },
      );
    }
  }

  return Object.fromEntries(updatedCartItems);
}

export interface CookieStorablePriceInfo extends Omit<PriceInfo, 'products'> { };

export const extractPriceInfoToStoreInSession = (priceInfo: PriceInfo): CookieStorablePriceInfo => ({
  sub_total: priceInfo.sub_total,
  tax_amount: priceInfo.tax_amount,
  shipping_fee: priceInfo.shipping_fee,
  discount_amount: priceInfo.discount_amount,
  origin_shipping_fee: priceInfo.origin_shipping_fee,
  shipping_fee_discount: priceInfo.shipping_fee_discount,
  promo_code_discount: priceInfo.promo_code_discount,
  discount_reason: priceInfo.discount_reason,
  total_amount: priceInfo.total_amount,
  currency: priceInfo.currency,
  vat_included: priceInfo.vat_included,
  discount_code_valid: priceInfo.discount_code_valid,
  discount_type: priceInfo.discount_type,
  percentage_off_amount: priceInfo.percentage_off_amount,
  applied_events: priceInfo.applied_events,
  discount_error_msgs: priceInfo.discount_error_msgs,
});

export const sortItemsByAddedTime = (cart: ShoppingCart): ShoppingCartItem[] => {
  const now = Date.now();
  return Object
    .keys(cart)
    .map(vuuid => cart[vuuid])
    .sort((i, j) => {
      const iAddedTime = i.added_time || now
      const jAddedTime = j.added_time || now
      return iAddedTime - jAddedTime;
    });
}

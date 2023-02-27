import type { ShoppingCart, ShoppingCartItem } from '~/sessions/shoppingcart.session';
import type { PurchasedProduct, PriceInfo } from './cart.server';


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

export interface CookieStorablePriceInfo extends Omit<PriceInfo, 'products'> { };

export const extractPriceInfoToStoreInSession = (priceInfo: PriceInfo): CookieStorablePriceInfo => ({
  sub_total: priceInfo.sub_total,
  tax_amount: priceInfo.tax_amount,
  shipping_fee: priceInfo.shipping_fee,
  discount_amount: priceInfo.discount_amount,
  discount_reason: priceInfo.discount_reason,
  total_amount: priceInfo.total_amount,
  currency: priceInfo.currency,
  vat_included: priceInfo.vat_included,
  discount_code_valid: priceInfo.discount_code_valid,
  discount_type: priceInfo.discount_type,
  percentage_off_amount: priceInfo.percentage_off_amount,
  applied_events: priceInfo.applied_events,
});
import type { ShoppingCart, ShoppingCartItem } from '~/sessions/shoppingcart.session';
import type { PurchasedProduct, PriceInfo } from './cart.server';


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

          // If `origin_unit_price` and `discounted_price` we got from '/data-server/ec/v1/accountant/order-amount'.
          // are equal, we don't update the `retailPrice` but use `retailPrice` value from shopping cart.
          // or else, we update the retailPrice coming from newly purchased products.
          retailPrice: prod.origin_unit_price.toString() === prod.discounted_price.toString()
            ? itemInCart.retailPrice.toString()
            : prod.origin_unit_price.toString(),
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
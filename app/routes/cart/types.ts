import type { ShoppingCart } from '~/sessions/types';

export type PurchasedProduct = {
  quantity: number,
  variation_uuid: string,
  origin_unit_price: number,
  discounted_price: number,
  discount_reason: string,
  total_origin_price: number,
  total_discounted_price: number,
};

export type PriceInfo = {
  sub_total: number;
  tax_amount: number;
  shipping_fee: number;
  origin_shipping_fee: number;
  discount_amount: number;
  shipping_fee_discount: number;
  promo_code_discount: number;
  discount_reason: string;
  total_amount: number;
  currency: string;
  vat_included: boolean;
  discount_code_valid: boolean;
  products: PurchasedProduct[];
  percentage_off_amount: number;
  discount_error_msgs: string[];

  // Exract discount type to enums.
  discount_type: 'free_shipping' | 'price_off' | 'percentage_off';

  // Extract `applied_events` to enums.
  applied_events: string[];
};

export type CartPriceResponse = {
  cart: ShoppingCart;
  priceInfo: PriceInfo;
};


export type RemoveCartItemActionDataType = {
  cart_item_count: number,
  price_info: PriceInfo | null,
};

export type ActionType =
  | 'remove_cart_item'
  | 'update_item_quantity'
  | 'apply_promo_code';

export type ApplyPromoCodeActionType = {
  discount_code: string;
  price_info: PriceInfo;
}

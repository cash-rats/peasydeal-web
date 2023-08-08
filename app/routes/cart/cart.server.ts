import httpStatus from 'http-status-codes';

import { envs } from '~/utils/get_env_source';
import type { ShoppingCart, ShoppingCartItem } from '~/sessions/shoppingcart.session';

export type PriceQuery = {
  variation_uuid: string;
  quantity: number;
};

export type FetchPriceInfoParams = {
  discount_code?: string
  products: PriceQuery[];
};

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

export const fetchPriceInfo = async (params: FetchPriceInfoParams): Promise<PriceInfo> => {
  const resp = await fetch(`${envs.MYFB_ENDPOINT}/data-server/ec/v1/accountant/order-amount`, {
    method: 'post',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    throw new Error(JSON.stringify(respJSON));
  }

  return respJSON as PriceInfo
}

export const convertShoppingCartToPriceQuery = (cart: ShoppingCart): PriceQuery[] => {
  return Object.keys(cart).reduce((queries, variationUUID) => {
    // Skip product with invalid product uuid.
    if (!variationUUID || variationUUID === 'undefined') {
      return queries;
    }
    const item: ShoppingCartItem = cart[variationUUID];
    return queries.concat([
      {
        variation_uuid: item.variationUUID,
        quantity: Number(item.quantity),
      }
    ]);
  }, [] as PriceQuery[]);
}
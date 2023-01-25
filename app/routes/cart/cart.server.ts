import httpStatus from 'http-status-codes';

import { MYFB_ENDPOINT } from '~/utils/get_env_source';
import type { ShoppingCart, ShoppingCartItem } from '~/sessions/shoppingcart.session';

export type PriceQuery = {
  variation_uuid: string;
  quantity: number;
};

export type FetchPriceInfoParams = {
  discount_code?: string
  products: PriceQuery[];
}

export type PriceInfo = {
  sub_total: number;
  tax_amount: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  vat_included: boolean;
  discount_code_valid: boolean;
  percentage_off_amount: number;
  discount_type: 'free_shipping' | 'price_off' | 'percentage_off';
}

export const fetchPriceInfo = async (params: FetchPriceInfoParams): Promise<PriceInfo> => {
  const resp = await fetch(`${MYFB_ENDPOINT}/data-server/ec/v1/accountant/order-amount`, {
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

  const trfmPriceInfo = transformToPriceInfo(respJSON)
  return trfmPriceInfo;
}

const transformToPriceInfo = (json: any): PriceInfo => {
  return { ...json, };
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
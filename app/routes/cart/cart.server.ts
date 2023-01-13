import httpStatus from 'http-status-codes';

import { getMYFBEndpoint } from '~/utils/endpoints';
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
  discount_type: 'free_shipping' | 'price_off' | 'percentage_off';
}

export const fetchPriceInfo = async (params: FetchPriceInfoParams): Promise<PriceInfo> => {
  console.log('debug 1', params);
  const resp = await fetch(`${getMYFBEndpoint()}/data-server/ec/v1/accountant/order-amount`, {
    method: 'post',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  console.log('debug 2', params);

  const respJSON = await resp.json();

  console.log('debug 3', respJSON);
  if (resp.status !== httpStatus.OK) {
    console.log('debug 4', respJSON);
    throw new Error(JSON.stringify(respJSON));
  }

  const trfmPriceInfo = transformToPriceInfo(respJSON)

  console.log('debug 5', respJSON);
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
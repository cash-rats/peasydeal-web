import httpStatus from 'http-status-codes';

import { getMYFBEndpoint } from '~/utils/endpoints';
import type { ShoppingCart, ShoppingCartItem } from '~/sessions/shoppingcart.session';

export type PriceQuery = {
  variation_uuid: string;
  quantity: number;
};

export type FetchPriceInfoParams = {
  products: PriceQuery[];
}

export type PriceInfo = {
  sub_total: number;
  tax_amount: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  currency: number;
}
export const fetchPriceInfo = async (params: FetchPriceInfoParams): Promise<PriceInfo> => {
  const resp = await fetch(`${getMYFBEndpoint()}/data-server/ec/v1/accountant/order-amount`, {
    method: 'post',
    body: new URLSearchParams({
      body: JSON.stringify(params),
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })

  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    throw new Error(JSON.stringify(respJSON));
  }

  return respJSON;
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
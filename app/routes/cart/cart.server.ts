import httpStatus from 'http-status-codes';
import type { PriceInfo } from './types';

import { envs } from '~/utils/env';
import type { ShoppingCart, ShoppingCartItem } from '~/sessions/types';

export type PriceQuery = {
  variation_uuid: string;
  quantity: number;
};

export type FetchPriceInfoParams = {
  discount_code?: string
  products: PriceQuery[];
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

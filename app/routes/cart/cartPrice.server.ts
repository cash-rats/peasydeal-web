import type { ShoppingCart } from '~/sessions/types';

import {
  fetchPriceInfo,
  convertShoppingCartToPriceQuery,
} from './cart.server';
import type { PriceInfo } from './types';
import { syncShoppingCartWithNewProductsInfo } from './utils';

export type CalculateCartPriceParams = {
  cart: ShoppingCart;
  promoCode?: string | null;
};

export type CalculateCartPriceResult = {
  cart: ShoppingCart;
  priceInfo: PriceInfo;
};

export const calculateCartPriceAndSession = async ({
  cart,
  promoCode = null,
}: CalculateCartPriceParams): Promise<CalculateCartPriceResult> => {
  const priceInfo = await fetchPriceInfo({
    products: convertShoppingCartToPriceQuery(cart),
    discount_code: promoCode ?? undefined,
  });

  return {
    cart: syncShoppingCartWithNewProductsInfo(cart, priceInfo.products),
    priceInfo,
  };
};

export const buildCartPriceJsonResponse = (result: CalculateCartPriceResult) => {
  return Response.json({
    cart: result.cart,
    priceInfo: result.priceInfo,
  });
};

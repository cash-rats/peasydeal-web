import type { Session } from 'react-router';

import { commitSession } from '~/sessions/redis_session.server';
import { setTransactionObject } from '~/sessions/transaction.session.server';
import type { ShoppingCart } from '~/sessions/types';

import {
  fetchPriceInfo,
  convertShoppingCartToPriceQuery,
} from './cart.server';
import type { PriceInfo } from './types';
import {
  extractPriceInfoToStoreInSession,
  syncShoppingCartWithNewProductsInfo,
} from './utils';

export type CalculateCartPriceParams = {
  request: Request;
  cart: ShoppingCart;
  promoCode?: string | null;
};

export type CalculateCartPriceResult = {
  cart: ShoppingCart;
  priceInfo: PriceInfo;
  session: Session;
};

export const calculateCartPriceAndSession = async ({
  request,
  cart,
  promoCode = null,
}: CalculateCartPriceParams): Promise<CalculateCartPriceResult> => {
  const priceInfo = await fetchPriceInfo({
    products: convertShoppingCartToPriceQuery(cart),
    discount_code: promoCode ?? undefined,
  });

  const sessionStorablePriceInfo = extractPriceInfoToStoreInSession(priceInfo);
  const session = await setTransactionObject(request, {
    promo_code: promoCode ?? null,
    price_info: sessionStorablePriceInfo,
  });

  return {
    cart: syncShoppingCartWithNewProductsInfo(cart, priceInfo.products),
    priceInfo,
    session,
  };
};

export const buildCartPriceJsonResponse = async (
  result: CalculateCartPriceResult,
) => {
  return Response.json(
    {
      cart: result.cart,
      priceInfo: result.priceInfo,
    },
    {
      headers: {
        'Set-Cookie': await commitSession(result.session),
      },
    },
  );
};


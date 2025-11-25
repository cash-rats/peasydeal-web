import type { ActionFunctionArgs } from 'react-router';
import httpStatus from 'http-status-codes';

import type { ShoppingCart } from '~/sessions/types';
import {
  calculateCartPriceAndSession,
  buildCartPriceJsonResponse,
} from '~/routes/cart/cartPrice.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const rawCart = formData.get('cart');
  const rawPromoCode = formData.get('promo_code');

  if (!rawCart || typeof rawCart !== 'string') {
    return new Response('Missing or invalid cart payload', {
      status: httpStatus.BAD_REQUEST,
    });
  }

  let cart: ShoppingCart;
  try {
    cart = JSON.parse(rawCart) as ShoppingCart;
  } catch {
    return new Response('Failed to parse cart payload', {
      status: httpStatus.BAD_REQUEST,
    });
  }

  const promoCode =
    rawPromoCode === null || rawPromoCode === undefined
      ? null
      : String(rawPromoCode);

  try {
    const result = await calculateCartPriceAndSession({
      cart,
      promoCode,
    });

    return buildCartPriceJsonResponse(result);
  } catch (error) {
    console.error('cart.price action error', error);

    return new Response('Failed to calculate cart price', {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

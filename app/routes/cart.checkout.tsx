import { redirect, type ActionFunctionArgs } from 'react-router';
import httpStatus from 'http-status-codes';

import type { ShoppingCart } from '~/sessions/types';
import {
  calculateCartPriceAndSession,
} from '~/routes/cart/cartPrice.server';
import {
  commitCheckoutSession,
  getCheckoutSession,
  setCheckoutSessionData,
} from '~/sessions/checkout.session.server';

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

    if (!result || Object.keys(result.cart || {}).length === 0) {
      return redirect('/cart');
    }

    const { session } = await getCheckoutSession(request);

    setCheckoutSessionData(session, {
      priceInfo: result.priceInfo,
      promoCode,
      cart: result.cart,
    });

    return redirect('/checkout', {
      headers: {
        'Set-Cookie': await commitCheckoutSession(session),
      },
    });
  } catch (error) {
    console.error('cart.checkout action error', error);

    return new Response('Failed to prepare checkout', {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

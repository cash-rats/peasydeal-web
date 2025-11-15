import type { ActionFunctionArgs } from 'react-router';
import httpStatus from 'http-status-codes';

import type { ShoppingCart } from '~/sessions/types';
import {
  calculateCartPriceAndSession,
  buildCartPriceJsonResponse,
} from '~/routes/cart/cartPrice.server';

type CartPriceRequestBody = {
  cart: ShoppingCart;
  promo_code?: string | null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method.toUpperCase() !== 'POST') {
    return new Response('Method Not Allowed', {
      status: httpStatus.METHOD_NOT_ALLOWED,
    });
  }

  const contentType = request.headers.get('content-type') || '';

  let body: CartPriceRequestBody | null = null;

  try {
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const form = await request.formData();
      const cartPayload = form.get('cart');
      const promoCode = form.get('promo_code');

      if (typeof cartPayload === 'string') {
        body = {
          cart: JSON.parse(cartPayload) as ShoppingCart,
          promo_code: typeof promoCode === 'string' ? promoCode : null,
        };
      }
    }
  } catch {
    return new Response('Invalid cart payload', {
      status: httpStatus.BAD_REQUEST,
    });
  }

  if (!body || !body.cart || typeof body.cart !== 'object') {
    return new Response('Missing or invalid cart payload', {
      status: httpStatus.BAD_REQUEST,
    });
  }

  try {
    const result = await calculateCartPriceAndSession({
      request,
      cart: body.cart,
      promoCode: body.promo_code ?? null,
    });

    return buildCartPriceJsonResponse(result);
  } catch (error) {
    console.error('cart.price action error', error);

    return new Response('Failed to calculate cart price', {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};


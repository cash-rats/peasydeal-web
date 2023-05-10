import { json } from '@remix-run/node';
import httpStatus from 'http-status-codes';

import {
  getCart,
  removeItem as sessionRemoveItem,
  CartSessionKey,
  updateCart,
} from '~/sessions/shoppingcart.session';
import { commitSession } from '~/sessions/redis_session';
import {
  setTransactionObject,
  sessionResetTransactionObject,
  sessionSetTransactionObject,
} from '~/sessions/transaction.session';

import {
  fetchPriceInfo,
  convertShoppingCartToPriceQuery,
} from './cart.server';
import { extractPriceInfoToStoreInSession } from './utils';

import type { PriceInfo } from './cart.server';


export type ActionType =
  | 'remove_cart_item'
  | 'update_item_quantity'
  | 'apply_promo_code'
  | 'buy_now';

export type ApplyPromoCodeActionType = {
  discount_code: string;
  price_info: PriceInfo;
}

export const applyPromoCode = async (request: Request, promoCode: string) => {
  try {
    const cart = await getCart(request);
    if (!cart || Object.keys(cart).length === 0) {
      return new Response('not able to apply promo code with empty cart');
    };

    const priceQuery = convertShoppingCartToPriceQuery(cart);

    const priceInfo = await fetchPriceInfo({
      discount_code: promoCode,
      products: priceQuery
    });

    // If promo code type is `free_shipping`, exempts shipping fee in `transaction.session`
    if (priceInfo.discount_type === 'free_shipping') {
      priceInfo.shipping_fee = 0;
    }

    return json<ApplyPromoCodeActionType>({
      price_info: priceInfo,
      discount_code: promoCode,
    }, {
      headers: {
        'Set-Cookie': await commitSession(
          await setTransactionObject(request, {
            promo_code: promoCode,
            price_info: extractPriceInfoToStoreInSession(priceInfo),
          })
        ),
      }
    });

  } catch (error) {
    throw json(`failed to process '/cart' loader, ${error}`, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export type RemoveCartItemActionDataType = {
  cart_item_count: number,
  price_info: PriceInfo | null,
};

export const removeCartItemAction = async (variationUUID: string, promoCode: string, request: Request) => {
  const session = await sessionRemoveItem(request, variationUUID);
  const cart = session.get(CartSessionKey);

  // If we deleted the last item is the cart, we reset the price info
  // by resetting `TransactionObject` in the session.
  if (!cart || Object.keys(cart).length <= 0) {
    return json<RemoveCartItemActionDataType>(
      {
        cart_item_count: 0,
        price_info: null,
      },
      {
        headers: {
          "Set-Cookie": await commitSession(
            await sessionResetTransactionObject(session),
          ),
        }
      },
    );
  }

  try {
    // Recalc price info.
    const priceQuery = convertShoppingCartToPriceQuery(cart);
    const priceInfo = await fetchPriceInfo({ products: priceQuery, discount_code: promoCode });

    // `cart_item_count` tells frontend when to perform page refresh. When `cart_item_count`
    // equals 0, frontend will trigger load of the current route which displays empty cart page.
    return json(
      {
        cart_item_count: Object.keys(cart).length,
        price_info: priceInfo,
      },
      {
        headers: {
          "Set-Cookie": await commitSession(
            // Set new `TransactionObject` to session.
            await sessionSetTransactionObject(session, {
              promo_code: promoCode,
              price_info: extractPriceInfoToStoreInSession(priceInfo),
            }),
          ),
        }
      });
  } catch (err) {
    // TODO throw response display 500 page.
    throw json(`failed to process \'/cart\' loader, ${err}`, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}

export const updateItemQuantity = async (request: Request, variationUUID: string, quantity: string, promoCode: string) => {
  try {
    const cart = await getCart(request);
    if (!cart || Object.keys(cart).length === 0) return null;
    const item = cart[variationUUID]
    if (!item) return null;
    item.quantity = quantity;

    const priceQuery = convertShoppingCartToPriceQuery(cart);

    const priceInfo = await fetchPriceInfo({
      products: priceQuery,
      discount_code: promoCode,
    });

    // Update transaction object
    const session = await sessionSetTransactionObject(
      await updateCart(request, cart),
      {
        price_info: extractPriceInfoToStoreInSession(priceInfo),
        promo_code: promoCode,
      },
    );

    return json<PriceInfo>(priceInfo, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    })
  } catch (error) {
    throw json(`failed to process \'/cart\' loader, ${error}`, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}
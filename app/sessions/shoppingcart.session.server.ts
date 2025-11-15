import type { Session } from 'react-router';

import { getCookieSession } from './session_utils.server';
import type { ShoppingCart, ShoppingCartItem } from './types';

export const CartSessionKey = 'shopping_cart';

// getCart get current shopping cart data in session. return "undefined" If no key exists.
export const getCart = async (request: Request): Promise<ShoppingCart | undefined> => {
  const session = await getCookieSession(request);
  if (!session.has(CartSessionKey)) return undefined;
  return session.get(CartSessionKey);
}

//  Count number of items in shopping cart from session if not logged in yet. Retrieve this information from API if user is logged in.
export const getItemCount = async (request: Request): Promise<number> => {
  const cart = await getCart(request);
  return !cart ? 0 : Object.keys(cart).length;
}

// - [x] updated
export const insertItem = async (request: Request, item: ShoppingCartItem): Promise<Session> => {
  const session = await getCookieSession(request);
  let shoppingCart: ShoppingCart = {};

  if (session.has(CartSessionKey)) {
    shoppingCart = session.get(CartSessionKey);
  }

  session.set(CartSessionKey, {
    ...shoppingCart,
    [item.variationUUID]: item,
  });
  return session;
};

export const clearCart = async (request: Request): Promise<Session> => {
  const session = await getCookieSession(request);
  session.unset(CartSessionKey);
  return session;
}

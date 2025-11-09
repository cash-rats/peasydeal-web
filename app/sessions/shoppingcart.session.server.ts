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

export const updateCart = async (request: Request, cart: ShoppingCart): Promise<Session> => {
  const session = await getCookieSession(request);
  session.set(CartSessionKey, cart);
  return session;
}

// - [ ] updated
export const getItem = async (request: Request, variationUUID: string): Promise<ShoppingCartItem | undefined> => {
  const session = await getCookieSession(request);
  if (!session.has(CartSessionKey)) return undefined;
  const shoppingCart = session.get('shopping_cart') as ShoppingCart;
  const item = shoppingCart[variationUUID];
  return item;
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

//  - [x] updated
export const removeItem = async (request: Request, variationUUID: string): Promise<Session> => {
  const session = await getCookieSession(request);
  const cart = await getCart(request);
  if (!cart || Object.keys(cart).length === 0) return session;
  if (cart.hasOwnProperty(variationUUID)) {
    delete cart[variationUUID];
    const newShoppingCart = { ...cart };
    session.set(CartSessionKey, newShoppingCart);
  }
  return session;
}

export const updateItem = async (request: Request, item: ShoppingCartItem): Promise<Session> => {
  const session = await getCookieSession(request);
  const itemInCart = await getItem(request, item.variationUUID);
  if (!itemInCart) {
    return insertItem(request, item);
  };
  const cart = session.get(CartSessionKey);
  cart[item.variationUUID] = item;
  session.set(CartSessionKey, cart);
  return session;
}

export const clearCart = async (request: Request): Promise<Session> => {
  const session = await getCookieSession(request);
  session.unset(CartSessionKey);
  return session;
}

import type { Session } from '@remix-run/node';

import { getSession } from '~/sessions';

export const CartSessionKey = 'shopping_cart';

export type ShoppingCart = {
  [prodUUID: string]: ShoppingCartItem;
};

export type ShoppingCartItem = {
  salePrice: string;
  retailPrice: string;
  productUUID: string;
  variationUUID: string;

  // product variation does not have "main_pic" yet, thus, we take the first product image to be displayed in shopping cart.
  image: string;
  quantity: string;
  title: string;
  specName: string
};

const getSessionCookie = async (request: Request): Promise<Session> => {
  return await getSession(request.headers.get("Cookie"));
}

// getCart get current shopping cart data in session. return "undefined" If no key exists.
export const getCart = async (request: Request): Promise<ShoppingCart | undefined> => {
  const session = await getSessionCookie(request);
  if (!session.has(CartSessionKey)) return undefined;
  return session.get(CartSessionKey);
}

export const getItem = async (request: Request, prodUUID: string): Promise<ShoppingCartItem | undefined> => {
  const session = await getSessionCookie(request);
  if (!session.has(CartSessionKey)) return undefined;
  const shoppingCart = session.get('shopping_cart') as ShoppingCart;
  const item = shoppingCart[prodUUID];
  return item;
}

//  Count number of items in shopping cart from session if not logged in yet. Retrieve this information from API if user is logged in.
export const getItemCount = async (request: Request): Promise<number> => {
  const cart = await getCart(request);
  return !cart ? 0 : Object.keys(cart).length;
}

export const insertItem = async (request: Request, item: ShoppingCartItem): Promise<Session> => {
  const session = await getSessionCookie(request);
  let shoppingCart: ShoppingCart = {};
  if (session.has(CartSessionKey)) {
    shoppingCart = session.get(CartSessionKey);
  }
  const newShoppingCart = {
    ...shoppingCart,
    [item.productUUID]: item,
  }
  session.set(CartSessionKey, newShoppingCart);
  return session;
};

export const removeItem = async (request: Request, prodUUID: string): Promise<Session> => {
  const session = await getSessionCookie(request);
  const cart = await getCart(request);
  if (!cart || Object.keys(cart).length === 0) return session;
  if (cart.hasOwnProperty(prodUUID)) {
    delete cart[prodUUID];
    const newShoppingCart = { ...cart };
    session.set(CartSessionKey, newShoppingCart);
  }
  return session;
}

export const updateItem = async (request: Request, item: ShoppingCartItem): Promise<Session> => {
  const session = await getSessionCookie(request);
  const itemInCart = await getItem(request, item.productUUID);
  if (!itemInCart) {
    return insertItem(request, item);
  };
  const cart = session.get(CartSessionKey);
  cart[item.productUUID] = item;
  session.set(CartSessionKey, cart);
  return session;
}
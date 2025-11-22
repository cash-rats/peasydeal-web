import { produce } from 'immer';
import type { ShoppingCart } from '~/sessions/types';

import type { PriceInfo } from './types';
import { syncShoppingCartWithNewProductsInfo } from './utils';

export type CartState = {
  cartItems: ShoppingCart;
  priceInfo: PriceInfo | null;
  promoCode: string;
};

export type CartAction =
  | { type: 'SET_PRICE_INFO', payload: PriceInfo | null }
  | { type: 'SET_PROMO_CODE', payload: string }
  | { type: 'REMOVE_CART_ITEM', payload: string }
  | { type: 'UPDATE_ITEM_QUANTITY', payload: { variationUUID: string, quantity: number } }
  | { type: 'SET_CART_ITEMS', payload: ShoppingCart };

export const setPriceInfo = (priceInfo: PriceInfo | null): CartAction => ({
  type: 'SET_PRICE_INFO',
  payload: priceInfo,
});

export const setPromoCode = (discountCode: string): CartAction => ({
  type: 'SET_PROMO_CODE',
  payload: discountCode,
});

export const removeCartItem = (variationUUID: string): CartAction => ({
  type: 'REMOVE_CART_ITEM',
  payload: variationUUID,
});

export const updateQuantity = (variationUUID: string, quantity: number): CartAction => ({
  type: 'UPDATE_ITEM_QUANTITY',
  payload: {
    variationUUID,
    quantity,
  }
});

export const setCartItems = (cart: ShoppingCart): CartAction => ({
  type: 'SET_CART_ITEMS',
  payload: cart,
});

const cartReducer = produce((draft: CartState, action: CartAction) => {
  switch (action.type) {
    case 'UPDATE_ITEM_QUANTITY': {
      const { variationUUID, quantity } = action.payload;

      draft.cartItems[variationUUID].quantity = quantity.toString();
      break;
    }
    case 'REMOVE_CART_ITEM': {
      const targetRemovalVariationUUID = action.payload as string;

      const updatedCartItems = Object.
        keys(draft.cartItems).
        reduce((newCartItems: ShoppingCart, variationUUID) => {
          if (variationUUID === targetRemovalVariationUUID) {
            return newCartItems;
          }

          newCartItems[variationUUID] = draft.cartItems[variationUUID];
          return newCartItems
        }, {});

      draft.cartItems = updatedCartItems;
      break;
    }
    case 'SET_PRICE_INFO': {
      const priceInfo = action.payload as PriceInfo | null;

      if (priceInfo === null) {
        draft.priceInfo = null;
        break;
      }

      const updatedCartItems = syncShoppingCartWithNewProductsInfo(draft.cartItems, priceInfo.products);

      draft.priceInfo = priceInfo;
      draft.cartItems = updatedCartItems;
      break;
    }
    case 'SET_PROMO_CODE': {
      const promoCode = action.payload as string;

      draft.promoCode = promoCode;
      break;
    }
    case 'SET_CART_ITEMS': {
      const cart = action.payload as ShoppingCart;

      draft.cartItems = cart;
      break;
    }
    default:
      return draft;
  }
});

export default cartReducer;

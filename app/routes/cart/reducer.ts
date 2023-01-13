import type { ShoppingCart } from '~/sessions/shoppingcart.session';

import type { PriceInfo } from './cart.server';

export enum CartActionTypes {
  set_cart_items = 'set_cart_items',
  update_cart_item = 'update_cart_item',

  set_price_info = 'set_price_info',
};

export type StateShape = {
  cartItems: ShoppingCart;
  priceInfo: PriceInfo | null;
}

export const initState: StateShape = {
  cartItems: {},
  priceInfo: null,
};

interface UpdateCartItemPayload {
  variationUUID: string;
  quantity: string;
};

interface CartActions {
  type: CartActionTypes;
  payload:
  | ShoppingCart
  | UpdateCartItemPayload
  | PriceInfo
  | null;
}

export const setCartItems = (cartItems: ShoppingCart) => {
  return {
    type: CartActionTypes.set_cart_items,
    payload: cartItems,
  };
}

export default function cartReducer(state: StateShape, action: CartActions): StateShape {
  switch (action.type) {
    case CartActionTypes.set_cart_items: {
      const cartItems = action.payload as ShoppingCart;
      return {
        ...state,
        cartItems,
      }
    }
    case CartActionTypes.update_cart_item: {
      const { variationUUID, quantity } = action.payload as UpdateCartItemPayload;

      return {
        ...state,
        cartItems: {
          ...state.cartItems,
          [variationUUID]: {
            ...state.cartItems[variationUUID],
            quantity,
          }
        }
      }
    }
    case CartActionTypes.set_price_info: {
      const priceInfo = action.payload as PriceInfo;
      return {
        ...state,
        priceInfo,
      }
    }
    default:
      return state;
  }
};
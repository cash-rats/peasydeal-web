import type { ShoppingCart } from '~/sessions/shoppingcart.session';

import type { PriceInfo } from './cart.server';
import { syncShoppingCartWithNewProductsInfo } from './utils';

export enum CartActionTypes {
  set_promo_code = 'set_promo_code',
  update_cart_item = 'update_cart_item',
  remove_cart_item = 'remove_cart_item',
  set_price_info = 'set_price_info',
};

export type StateShape = {
  cartItems: ShoppingCart;
  priceInfo: PriceInfo | null;
  promoCode: string;
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
  | string
  | null;
}

export const setPriceInfo = (priceInfo: PriceInfo) => {
  return {
    type: CartActionTypes.set_price_info,
    payload: priceInfo,
  };
};

export const setPromoCode = (discountCode: string) => {
  return {
    type: CartActionTypes.set_promo_code,
    payload: discountCode,
  };
};

export const removeCartItem = (variationUUID: string) => {
  return {
    type: CartActionTypes.remove_cart_item,
    payload: variationUUID,
  };
};

export const updateQuantity = (variationUUID: string, quantity: number) => {
  return {
    type: CartActionTypes.update_cart_item,
    payload: {
      variationUUID,
      quantity: quantity.toString(),
    }
  };
};

export default function cartReducer(state: StateShape, action: CartActions): StateShape {
  switch (action.type) {
    case CartActionTypes.update_cart_item: {
      const { variationUUID, quantity } = action.payload as UpdateCartItemPayload;

      return {
        ...state,
        cartItems: {
          ...state.cartItems,
          [variationUUID]: {
            ...state.cartItems[variationUUID],
            quantity,
          },
        },
      };
    }
    case CartActionTypes.remove_cart_item: {
      const targetRemovalVariationUUID = action.payload as string;

      const updatedCartItems = Object.
        keys(state.cartItems).
        reduce((newCartItems: ShoppingCart, variationUUID) => {
          if (variationUUID === targetRemovalVariationUUID) {
            return newCartItems;
          }

          newCartItems[variationUUID] = state.cartItems[variationUUID];
          return newCartItems
        }, {});

      return {
        ...state,
        cartItems: updatedCartItems,
      };
    }
    case CartActionTypes.set_price_info: {
      const priceInfo = action.payload as PriceInfo | null;

      if (priceInfo === null) {
        return {
          ...state,
          priceInfo,
        };
      }

      const updatedCartItems = syncShoppingCartWithNewProductsInfo(state.cartItems, priceInfo.products);

      return {
        ...state,
        priceInfo,
        cartItems: updatedCartItems,
      };
    }
    case CartActionTypes.set_promo_code: {
      const promoCode = action.payload as string;

      return {
        ...state,
        promoCode,
      };
    }
    default:
      return state;
  }
};
import { useReducer } from 'react';
import { type ShoppingCart } from '~/sessions/shoppingcart.session';

import cartReducer, { type CartState } from '../reducer';
import { type PriceInfo } from '../types';

interface UseCartStateProps  {
    cart: ShoppingCart;
    priceInfo: PriceInfo | null;
}

export const useCartState = ({ cart, priceInfo }: UseCartStateProps) => {
  const [state, dispatch] = useReducer(cartReducer, {
    cartItems: cart,
    priceInfo: priceInfo,
    promoCode: '',
  } as CartState);

  return { state, dispatch };
}
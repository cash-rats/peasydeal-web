import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useRouteLoaderData } from 'react-router';

import type { ShoppingCart } from '~/sessions/types';
import { useLocalCart } from './useLocalCart';

type CartContextValue = {
  cart: ShoppingCart;
  setCart: (nextCart: ShoppingCart) => void;
  cartCount: number;
  isInitialized: boolean;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const rootData = useRouteLoaderData('root') as { cartCount?: number } | undefined;
  const fallbackCount = rootData?.cartCount ?? 0;
  const { cart, setCart, isInitialized } = useLocalCart();

  const cartCount = isInitialized ? Object.keys(cart).length : fallbackCount;

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      setCart,
      cartCount,
      isInitialized,
    }),
    [cart, setCart, cartCount, isInitialized],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }

  return context;
}


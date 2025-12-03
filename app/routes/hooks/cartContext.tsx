import { createContext, useContext, useMemo, type ReactNode } from 'react';

import type { ShoppingCart } from '~/sessions/types';
import { useLocalCart } from './useLocalCart';

type CartContextValue = {
  cart: ShoppingCart;
  setCart: (nextCart: ShoppingCart) => void;
  cartCount: number;
  isInitialized: boolean;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const { cart, setCart, isInitialized, clearCart } = useLocalCart();

  const cartCount = isInitialized ? Object.keys(cart).length : 0;

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      setCart,
      cartCount,
      isInitialized,
      clearCart,
    }),
    [cart, setCart, cartCount, isInitialized, clearCart],
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

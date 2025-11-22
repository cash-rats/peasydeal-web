import { useEffect, useState } from 'react';

import type { ShoppingCart } from '~/sessions/types';
import { loadCart, saveCart } from '~/lib/cartStorage.client';

type UseLocalCartParams = {
  initialCart?: ShoppingCart;
};

type UseLocalCartResult = {
  cart: ShoppingCart;
  setCart: (nextCart: ShoppingCart) => void;
  isInitialized: boolean;
};

export const useLocalCart = ({
  initialCart,
}: UseLocalCartParams = {}): UseLocalCartResult => {
  const [cart, setCart] = useState<ShoppingCart>(initialCart ?? {});
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const hydrateFromStorage = async () => {
      const storedCart = await loadCart();

      if (cancelled) {
        return;
      }

      if (storedCart && Object.keys(storedCart).length > 0) {
        setCart(storedCart);
      }

      setIsInitialized(true);
    };

    hydrateFromStorage();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    saveCart(cart);
  }, [cart, isInitialized]);

  return {
    cart,
    setCart,
    isInitialized,
  };
};


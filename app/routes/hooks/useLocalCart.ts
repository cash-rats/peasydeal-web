import { useCallback, useEffect, useState } from 'react';

import type { ShoppingCart } from '~/sessions/types';
import {
  loadCart,
  saveCart,
  clearCart as clearCartFromStorage,
} from '~/lib/cartStorage.client';

type UseLocalCartParams = {
  initialCart?: ShoppingCart;
};

type UseLocalCartResult = {
  cart: ShoppingCart;
  setCart: (nextCart: ShoppingCart) => void;
  isInitialized: boolean;
  clearCart: () => Promise<void>;
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

  const clearCart = useCallback(async () => {
    setCart({});

    try {
      await clearCartFromStorage();
    } catch (error) {
      console.error('clearCart in IndexedDB failed', error);
    }
  }, [setCart]);

  return {
    cart,
    setCart,
    isInitialized,
    clearCart,
  };
};

import { useCallback, useEffect, useRef, useState } from 'react';

import { getSessionIDFromSessionStore } from '~/services/daily_session';
import type { ShoppingCart, ShoppingCartItem } from '~/sessions/types';
import { useCartContext } from '~/routes/hooks';

import { tryPickUserSelectedVariationImage } from '../utils';
import type { ProductImg } from '../types';

interface UseAddToCartProps {
  sessionStorableCartItem: ShoppingCartItem;
  variationImages: ProductImg[];
}

export function useAddToCart({ sessionStorableCartItem, variationImages }: UseAddToCartProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const modalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { cart, setCart } = useCartContext();

  const addItemToCart = useCallback(async () => {
    setIsAddingToCart(true);

    try {
      const item: ShoppingCartItem = {
        ...sessionStorableCartItem,
        image: tryPickUserSelectedVariationImage(
          sessionStorableCartItem.variationUUID,
          variationImages,
        ) || sessionStorableCartItem.image,
        added_time: Date.now().toString(),
      };

      const nextCart: ShoppingCart = {
        ...cart,
        [item.variationUUID]: item,
      };

      setCart(nextCart);

      const gaSessionID = getSessionIDFromSessionStore();
      window.rudderanalytics?.track('click_add_to_cart', {
        session: gaSessionID,
        product: item.productUUID,
      });

      setOpenSuccessModal(true);
      modalTimerRef.current = setTimeout(() => {
        setOpenSuccessModal(false);
      }, 1800);
    } finally {
      setIsAddingToCart(false);
    }
  }, [
    sessionStorableCartItem,
    variationImages,
    cart,
    setCart,
  ]);

  useEffect(() => {
    return () => {
      if (modalTimerRef.current) {
        clearTimeout(modalTimerRef.current);
      }
    };
  }, []);

  return {
    addItemToCart,
    isAddingToCart,
    openSuccessModal,
    setOpenSuccessModal,
  };
}

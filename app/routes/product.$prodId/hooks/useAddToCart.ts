import { useFetcher } from 'react-router';
import { useCallback, useEffect, useState } from 'react';

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
  const addToCartFetcher = useFetcher();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const { cart, setCart } = useCartContext();

  const addItemToCart = useCallback(async () => {
    const item: ShoppingCartItem = {
      ...sessionStorableCartItem,
      image: tryPickUserSelectedVariationImage(
        sessionStorableCartItem.variationUUID,
        variationImages,
      ) || sessionStorableCartItem.image,

      added_time: Date.now().toString(),
    };

    console.log('~~ addItemToCart 1', item);

    const nextCart: ShoppingCart = {
      ...cart,
      [item.variationUUID]: item,
    };

    console.log('~~ addItemToCart 2', nextCart);
    setCart(nextCart);

    const gaSessionID = getSessionIDFromSessionStore();
    window.rudderanalytics?.track('click_add_to_cart', {
      session: gaSessionID,
      product: item.productUUID,
    });

    addToCartFetcher.submit(
      {
        __action: 'add_item_to_cart',
        item: JSON.stringify(item),
      },
      {
        method: 'post',
        action: `/product/${item.productUUID}`,
      },
    );
  }, [
    sessionStorableCartItem,
    variationImages,
    addToCartFetcher,
    cart,
    setCart,
  ]);

  useEffect(() => {
    if (addToCartFetcher.type === 'done') {
      setOpenSuccessModal(true);

      // Close the modal after 1 second
      setTimeout(() => {
        setOpenSuccessModal(false);
      }, 1000);

      // Cart count updates automatically via root loader revalidation
    }
  }, [addToCartFetcher.type]);

  return {
    addItemToCart,
    isAddingToCart: addToCartFetcher.state !== 'idle',
    openSuccessModal,
    setOpenSuccessModal,
  };
}

import { useFetcher } from 'react-router';
import { useCallback, useEffect, useState } from 'react';

import { getSessionIDFromSessionStore } from '~/services/daily_session';
import type { ShoppingCartItem } from '~/sessions/types';

import { tryPickUserSelectedVariationImage } from '../utils';
import type { ProductImg } from '../types';

interface UseAddToCartProps {
  sessionStorableCartItem: ShoppingCartItem;
  variationImages: ProductImg[];
}

export function useAddToCart({ sessionStorableCartItem, variationImages }: UseAddToCartProps) {
  const addToCartFetcher = useFetcher();
  const reloadCartItemCount = useFetcher();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const addItemToCart = useCallback(() => {
    const item = {
      ...sessionStorableCartItem,
      image: tryPickUserSelectedVariationImage(
        sessionStorableCartItem.variationUUID,
        variationImages,
      ) || sessionStorableCartItem.image,

      added_time: Date.now().toString(),
    };

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
  ]);

  useEffect(() => {
    if (addToCartFetcher.type === 'done') {
      setOpenSuccessModal(true);

      // Close the modal after 1 second
      setTimeout(() => {
        setOpenSuccessModal(false);
      }, 1000);

      // Reload the cart item count
      reloadCartItemCount.submit(
        null,
        {
          method: 'post',
          action: '/components/Header?index',
          replace: true,
        }
      );
    }
  }, [ addToCartFetcher.type ]);

  return {
    addItemToCart,
    isAddingToCart: addToCartFetcher.state !== 'idle',
    openSuccessModal,
    setOpenSuccessModal,
  };
}
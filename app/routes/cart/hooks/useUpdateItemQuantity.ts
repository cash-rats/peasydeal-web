import { useFetcher } from '@remix-run/react';
import { useEffect, useState, useCallback, type MouseEvent } from 'react';

import type { PriceInfo } from '../types';
import { setPriceInfo, updateQuantity } from '../reducer';
import type { CartAction } from '../reducer';

import { type ShoppingCart } from '~/sessions/shoppingcart.session';

interface UseUpdateItemQuantityProps {
  dispatch: (action: CartAction) => void;
  shoppingCart: ShoppingCart;
  promoCode: string;
}

export const useUpdateItemQuantity = ({ dispatch, shoppingCart, promoCode }: UseUpdateItemQuantityProps) => {
  const fetcher = useFetcher();
  const [updatingQuantity, setUpdatingQuantity] = useState(false);

  const handleOnClickQuantity = useCallback((evt: MouseEvent<HTMLLIElement>, variationUUID: string, number: number) => {
    // If user hasn't changed anything. don't bother to update the quantity.
    if (
      shoppingCart[variationUUID] &&
      Number(shoppingCart[variationUUID].quantity) === number
    ) return;

    dispatch(updateQuantity(variationUUID, number));
    setUpdatingQuantity(true);

    fetcher.submit(
      {
        __action: 'update_item_quantity',
        variation_uuid: variationUUID,
        quantity: number.toString(),
        promo_code: promoCode,
      },
      {
        method: 'post',
        action: '/cart?index',
      },
    );
  }, [dispatch, shoppingCart, promoCode, fetcher]);

  // When user update the quantity, we need to update the cost info calced by backend as well.
  useEffect(() => {
    if (fetcher.type === 'done') {
      const priceInfo = fetcher.data as PriceInfo;
      if (!priceInfo) return;

      dispatch(setPriceInfo(priceInfo));
      setUpdatingQuantity(false);
    }
  }, [fetcher.type]);

  return {
    updateItemQuantityFetcher: fetcher,
    updatingQuantity,
    handleOnClickQuantity,
  }
}
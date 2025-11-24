import { useFetcher } from 'react-router';
import { useEffect, useState, useCallback, type MouseEvent } from 'react';

import type { CartPriceResponse } from '../types';
import { setPriceInfo, updateQuantity } from '../reducer';
import type { CartAction } from '../reducer';

import { type ShoppingCart } from '~/sessions/types';

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

    const nextCart: ShoppingCart = {
      ...shoppingCart,
      [variationUUID]: {
        ...shoppingCart[variationUUID],
        quantity: number.toString(),
      },
    };

    dispatch(updateQuantity(variationUUID, number));
    setUpdatingQuantity(true);

    fetcher.submit(
      {
        cart: JSON.stringify(nextCart),
        promo_code: promoCode,
      },
      {
        method: 'post',
        action: '/cart/price',
      },
    );
  }, [dispatch, shoppingCart, promoCode, fetcher]);

  // When user update the quantity, we need to update the cost info calced by backend as well.
  useEffect(() => {
    if (fetcher.state !== 'idle') return;
    if (!fetcher.data) return;

    const data = fetcher.data as CartPriceResponse;
    if (!data || !data.priceInfo) return;

    dispatch(setPriceInfo(data.priceInfo));
    setUpdatingQuantity(false);
  }, [fetcher.state, fetcher.data, dispatch]);

  return {
    updateItemQuantityFetcher: fetcher,
    updatingQuantity,
    handleOnClickQuantity,
  }
}

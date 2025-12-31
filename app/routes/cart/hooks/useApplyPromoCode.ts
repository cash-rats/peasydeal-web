import { useFetcher } from 'react-router';
import { useEffect, useCallback, useState } from 'react';

import type { CartPriceResponse } from '../types';
import { type CartAction, setPriceInfo, setPromoCode } from '../reducer';
import type { ShoppingCart } from '~/sessions/types';

interface UseApplyPromoCodeProps {
  dispatch: (action: CartAction) => void;
  shoppingCart: ShoppingCart;
}

export const useApplyPromoCode = ({ dispatch, shoppingCart }: UseApplyPromoCodeProps) => {
  const fetcher = useFetcher();
  const [applying, setApplying] = useState(false);

  const handleClickApplyPromoCode = useCallback((code: string) => {
    setApplying(true);
    dispatch(setPromoCode(code));

    fetcher.submit(
      {
        cart: JSON.stringify(shoppingCart),
        promo_code: code,
      },
      {
        method: 'post',
        action: '/api/cart/price',
      },
    );
  }, [fetcher, dispatch, shoppingCart]);

  // Update the resulting price info to display when user applied promo code.
  useEffect(() => {
    if (fetcher.state !== 'idle') return;
    if (!fetcher.data) return;

    const data = fetcher.data as CartPriceResponse;
    if (!data || !data.priceInfo) return;

    dispatch(setPriceInfo(data.priceInfo));
    setApplying(false);
  }, [fetcher.state, fetcher.data, dispatch]);

  return { handleClickApplyPromoCode, applying };
}

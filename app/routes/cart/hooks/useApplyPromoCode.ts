import { useFetcher } from '@remix-run/react';
import { useEffect, useCallback, useState } from 'react';

import { type ApplyPromoCodeActionType } from '../types';
import { type CartAction, setPriceInfo, setPromoCode } from '../reducer';

interface UseApplyPromoCodeProps {
  dispatch: (action: CartAction) => void;
}

export const useApplyPromoCode = ({ dispatch }: UseApplyPromoCodeProps) => {
  const fetcher = useFetcher();
  const [applying, setApplying] = useState(false);

  const handleClickApplyPromoCode = useCallback((code: string) => {
    setApplying(true);

    fetcher.submit(
      {
        __action: 'apply_promo_code',
        promo_code: code,
      },
      {
        method: 'post',
        action: '/cart?index',
      },
    );
  }, [fetcher]);

  // Update the resulting price info to display when user applied promo code.
  useEffect(() => {
    if (fetcher.type === 'done') {
      const data = fetcher.data as ApplyPromoCodeActionType
      dispatch(setPromoCode(data.discount_code));
      dispatch(setPriceInfo(data.price_info))
      setApplying(false);
    }
  }, [fetcher.type]);

  return { handleClickApplyPromoCode, applying };
}
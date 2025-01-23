import { useEffect, useState, type MouseEvent } from 'react';
import { useFetcher } from "@remix-run/react"

import { setPriceInfo } from '../reducer';
import {
  type RemoveCartItemActionDataType,
} from '../types';
import { type CartAction, removeCartItem } from '../reducer';

interface UseRemoveItemProps {
  dispatch: (action: CartAction) => void;
  promoCode: string;
}

export const useRemoveItem = ({ dispatch, promoCode }: UseRemoveItemProps) => {
  const fetcher = useFetcher();
  const cartItemCountFetcher = useFetcher();
  const [removing, setRemoving] = useState(false);

  const handleRemove = (evt: MouseEvent<HTMLButtonElement>, variationUUID: string) => {
    setRemoving(true);

    dispatch(removeCartItem(variationUUID));

    fetcher.submit(
      {
        __action: 'remove_cart_item',
        variation_uuid: variationUUID,
        promo_code: promoCode,
      },
      {
        method: 'post',
        action: '/cart?index',
      },
    )
  }

  // If cart item contains no item, we simply redirect user to `/cart` so that
  // corresponding loader can display empty cart page to user.
  useEffect(() => {
    if (fetcher.type === 'done') {
      const { price_info } = fetcher.data as RemoveCartItemActionDataType;
      if (!price_info) return;

      setRemoving(false);
      dispatch(setPriceInfo(price_info));

      cartItemCountFetcher.submit(
        null,
        {
          method: 'post',
          action: '/components/Header?index',
          replace: true,
        },
      )
    }
  }, [
    fetcher.type,
  ]);

  return {
    removing,
    handleRemove,
  }
}
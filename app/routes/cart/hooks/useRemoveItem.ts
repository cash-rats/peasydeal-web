import { useEffect, useState, type MouseEvent } from 'react';
import { useFetcher } from "react-router"

import { setPriceInfo, type CartAction, removeCartItem } from '../reducer';
import type { CartPriceResponse } from '../types';
import type { ShoppingCart } from '~/sessions/types';

interface UseRemoveItemProps {
  dispatch: (action: CartAction) => void;
  promoCode: string;
  shoppingCart: ShoppingCart;
}

// If cart item contains no item, we simply redirect user to `/cart` so that
// corresponding loader can display empty cart page to user.
export const useRemoveItem = ({ dispatch, promoCode, shoppingCart }: UseRemoveItemProps) => {
  const fetcher = useFetcher();
  const [removing, setRemoving] = useState(false);

  const handleRemove = (evt: MouseEvent<HTMLButtonElement>, variationUUID: string) => {
    const nextCart: ShoppingCart = Object.keys(shoppingCart).reduce((acc, key) => {
      if (key === variationUUID) {
        return acc;
      }
      acc[key] = shoppingCart[key];
      return acc;
    }, {} as ShoppingCart);

    dispatch(removeCartItem(variationUUID));

    // If cart becomes empty, clear price info locally without calling server.
    if (!Object.keys(nextCart).length) {
      dispatch(setPriceInfo(null));
      setRemoving(false);
      return;
    }

    setRemoving(true);

    fetcher.submit(
      {
        cart: JSON.stringify(nextCart),
        promo_code: promoCode,
      },
      {
        method: 'post',
        action: '/api/cart/price',
      },
    );
  }

  // If cart item contains no item, we simply redirect user to `/cart` so that
  // corresponding loader can display empty cart page to user.
  useEffect(() => {
    if (fetcher.state !== 'idle') return;
    if (!fetcher.data) return;

    const data = fetcher.data as CartPriceResponse;
    if (!data || !data.priceInfo) return;

    setRemoving(false);
    dispatch(setPriceInfo(data.priceInfo));
  }, [fetcher.state, fetcher.data, dispatch]);

  return {
    itemRemoveFetcher: fetcher,
    removing,
    handleRemove,
  }
}

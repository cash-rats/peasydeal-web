import { useEffect, useMemo, useState } from 'react';
import {
  useFetcher,
  useNavigate,
  useRouteError,
  isRouteErrorResponse,
} from 'react-router';
import type {
  ShouldRevalidateFunction,
} from 'react-router';
import httpStatus from 'http-status-codes';
import FiveHundredError from '~/components/FiveHundreError';
import ClientOnly from '~/components/ClientOnly';
import LoadingBackdrop from '~/components/PeasyDealLoadingBackdrop';
import { useCartState, useUpdateItemQuantity, useApplyPromoCode } from '~/routes/cart/hooks';

import type { CartPriceResponse } from '~/routes/cart/types';
import { sortItemsByAddedTime } from '~/routes/cart/utils';
import { loadCart as loadCartFromClient } from '~/lib/cartStorage.client';
import { setCartItems, setPriceInfo } from '~/routes/cart/reducer';
import { useRemoveItem } from '~/routes/cart/hooks/useRemoveItem';
import { useCartContext } from '~/routes/hooks';

import { CartPage } from '~/components/v2/CartPage/CartPage';
import type { CartPageItem } from '~/components/v2/CartPage/CartPage';
import { SUPER_DEAL_OFF } from '~/shared/constants';
import { round10 } from '~/utils/preciseRound';

export const shouldRevalidate: ShouldRevalidateFunction = ({ formAction, formData }) => {
  if (
    formAction &&
    formAction.includes('/components/HorizontalProductsLayout')
  ) {
    return false
  }

  if (formData) {
    const action = formData.get('__action');
    if (
      action === 'apply_promo_code' ||
      action === 'update_item_quantity' ||
      action === 'remove_cart_item'
    ) {
      return false;
    }
  }

  return true
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === httpStatus.NOT_FOUND) {
      return (
        <CartPage items={[]} />
      );
    }

    return (
      <FiveHundredError
        error={new Error(error.data)}
        statusCode={error.status}
      />
    );
  }

  return (
    <FiveHundredError
      error={error instanceof Error ? error : new Error('Unknown error')}
      statusCode={httpStatus.INTERNAL_SERVER_ERROR}
    />
  );
}

function Cart() {
  const navigate = useNavigate();
  const { state, dispatch } = useCartState({
    cart: {},
    priceInfo: null,
  });

  const cartPriceFetcher = useFetcher<CartPriceResponse>();
  const checkoutFetcher = useFetcher();
  const [hydrated, setHydrated] = useState(false);
  const { setCart } = useCartContext();

  // Scroll to top when cart page rendered.
  useEffect(() => {
    if (!window) return;
    window.scrollTo(0, 0);
  }, []);

  // Hydrate cart from IndexedDB and fetch initial price info.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cancelled = false;

    const hydrateCart = async () => {
      const storedCart = await loadCartFromClient();
      if (cancelled) return;

      if (!storedCart || Object.keys(storedCart).length === 0) {
        dispatch(setCartItems({}));
        dispatch(setPriceInfo(null));
        setHydrated(true);
        return;
      }

      dispatch(setCartItems(storedCart));

      cartPriceFetcher.submit(
        {
          cart: JSON.stringify(storedCart),
          promo_code: '',
        },
        {
          method: 'post',
          action: '/api/cart/price',
        },
      );

      setHydrated(true);
    };

    hydrateCart();

    return () => {
      cancelled = true;
    };
  }, []);

  // Apply initial price info from /api/cart/price.
  useEffect(() => {
    if (cartPriceFetcher.state !== 'idle') return;
    if (!cartPriceFetcher.data) return;

    const data = cartPriceFetcher.data as CartPriceResponse;
    if (!data || !data.priceInfo) return;

    dispatch(setPriceInfo(data.priceInfo));
  }, [cartPriceFetcher.state, cartPriceFetcher.data, dispatch]);

  useEffect(() => {
    if (!hydrated) return;

    setCart(state.cartItems);
  }, [state.cartItems, hydrated, setCart]);

  const { removing, handleRemove, itemRemoveFetcher } = useRemoveItem({
    dispatch,
    promoCode: state.promoCode,
    shoppingCart: state.cartItems,
  });
  const {
    updateItemQuantityFetcher,
    handleOnClickQuantity,
  } = useUpdateItemQuantity({
    dispatch,
    shoppingCart: state.cartItems,
    promoCode: state.promoCode,
  });

  const isPriceCalculating = (
    updateItemQuantityFetcher.state !== 'idle' ||
    itemRemoveFetcher.state !== 'idle' ||
    cartPriceFetcher.state !== 'idle' ||
    checkoutFetcher.state !== 'idle' ||
    removing
  );

  const handleCheckout = () => {
    if (isPriceCalculating) return;

    checkoutFetcher.submit(
      {
        cart: JSON.stringify(state.cartItems),
        promo_code: state.promoCode || '',
      },
      {
        method: 'post',
        action: '/api/cart/checkout',
      },
    );
  };

  // Map shopping cart items to v2 CartPageItem format
  const cartPageItems: CartPageItem[] = useMemo(() =>
    sortItemsByAddedTime(state.cartItems).map(item => {
      const isSuperDeal = item.tagComboTags?.includes('super_deal');
      const sp = Number(item.salePrice) || undefined;
      const adjustedSalePrice = isSuperDeal && sp != null
        ? round10(sp * SUPER_DEAL_OFF, -2)
        : sp;
      return {
        id: item.variationUUID,
        name: item.title,
        variant: item.specName,
        thumbnailSrc: item.image,
        salePrice: adjustedSalePrice,
        originalSalePrice: isSuperDeal && sp != null ? sp : undefined,
        retailPrice: Number(item.retailPrice),
        quantity: Number(item.quantity),
        currency: '£',
      };
    }),
    [state.cartItems],
  );

  const handleQuantityChange = (id: string, qty: number) => {
    // The v1 hook expects (event, variationUUID, quantity)
    // We synthesize a minimal event-like object
    handleOnClickQuantity(
      { preventDefault: () => {} } as any,
      id,
      qty,
    );
  };

  const handleRemoveItem = (id: string) => {
    handleRemove({ preventDefault: () => {} } as any, id);
  };

  if (!hydrated) {
    return (
      <ClientOnly>
        <LoadingBackdrop open />
      </ClientOnly>
    );
  }

  return (
    <>
      <LoadingBackdrop open={isPriceCalculating} />

      <CartPage
        items={cartPageItems}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        onContinueShopping={() => navigate('/')}
        currency="£"
      />
    </>
  );
}

export default Cart;

import { useEffect, useMemo, useState } from 'react';
import {
  useFetcher,
  useRouteError,
  isRouteErrorResponse,
} from 'react-router';
import type {
  ShouldRevalidateFunction,
} from 'react-router';
import httpStatus from 'http-status-codes';
import { FcHighPriority } from 'react-icons/fc';
import { HiLockClosed } from 'react-icons/hi';
import LoadingBackdrop from '~/components/PeasyDealLoadingBackdrop';
import FiveHundredError from '~/components/FiveHundreError';
import PaymentMethods from '~/components/PaymentMethods';
import ClientOnly from '~/components/ClientOnly';
import { useCartState, useUpdateItemQuantity, useApplyPromoCode } from '~/routes/cart/hooks';

import CartItem from '~/routes/cart/components/Item';
import EmptyShoppingCart from '~/routes/cart/components/EmptyShoppingCart';
import PriceResult from '~/routes/cart/components/PriceResult';
import type { CartPriceResponse } from '~/routes/cart/types';
import { sortItemsByAddedTime } from '~/routes/cart/utils';
import { round10 } from '~/utils/preciseRound';
import { loadCart as loadCartFromClient } from '~/lib/cartStorage.client';
import { setCartItems, setPriceInfo } from '~/routes/cart/reducer';
import { useRemoveItem } from '~/routes/cart/hooks/useRemoveItem';
import { useCartContext } from '~/routes/hooks';

const FREE_SHIPPING = 19.99;

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

// TODOs:
//   - [ ] handle prod_id is falsey value
//   - [ ] handle session key not exists
// Note: Buy Now now writes directly to IndexedDB on the client.

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === httpStatus.NOT_FOUND) {
      return (<EmptyShoppingCart />);
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

/*
 * Coppy shopee's layout
 * @see https://codepen.io/justinklemm/pen/kyMjjv
 *
 * container width: max-width: 1180px;
 *
 * - [x] show empty shopping cart when no item existed yet, empty shipping cart should be a component instead of a route.
 * - [x] Add `~~$99.98 Now $49.99 You Saved $50` text.
 * - [x] When quantity is deducted to 0, popup a notification that the item is going to be removed.
 * - [x] Checkout flow.
 * - [x] 重複點擊同個 quantity 會 重新 calculate price。
 * - [x] use useReducer to cleanup useState
 */
function Cart() {
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
  const { handleClickApplyPromoCode, applying } = useApplyPromoCode({
    dispatch,
    shoppingCart: state.cartItems,
  });

  const isPriceCalculating = (
    updateItemQuantityFetcher.state !== 'idle' ||
    itemRemoveFetcher.state !== 'idle' ||
    cartPriceFetcher.state !== 'idle' ||
    checkoutFetcher.state !== 'idle' ||
    applying ||
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

  const freeshippingRequiredPrice = useMemo(() => {
    if (!state.priceInfo) return 0;

    const _vatPrice = state.priceInfo?.sub_total + state.priceInfo?.tax_amount;
    const _freeshippingRequiredPrice = FREE_SHIPPING - _vatPrice;

    return _freeshippingRequiredPrice;
  }, [state.priceInfo]);


  if (!hydrated) {
    return (
      <ClientOnly>
        <LoadingBackdrop open />
      </ClientOnly>
    );
  }

  if (Object.keys(state.cartItems).length === 0) {
    return (
      <EmptyShoppingCart />
    );
  }

  return (
    <>
      <LoadingBackdrop open={isPriceCalculating} />

      <section className="bg-slate-50 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {freeshippingRequiredPrice > 0 ? (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-[#fc1d7a]/30 bg-white p-4 shadow-sm">
              <FcHighPriority fontSize={22} className="mt-0.5 text-[#fc1d7a]" />
              <p className="text-sm sm:text-base text-slate-700">
                <span className="font-bold text-[#fc1d7a]">Wait!</span>
                {` Spend £${round10(freeshippingRequiredPrice, -2)} more to get free shipping`}
              </p>
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Shopping Cart
              </h1>
              <span className="text-slate-500 font-medium text-base sm:text-lg">
                {Object.keys(state.cartItems).length}{' '}
                {Object.keys(state.cartItems).length > 1 ? 'items' : 'item'}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
              <HiLockClosed aria-hidden className="h-5 w-5 text-emerald-600" />
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                SSL Secure Connection
              </span>
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-8 space-y-4 sm:space-y-6">
              <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-3 mb-2">
                <div className="col-span-6">Item</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {sortItemsByAddedTime(state.cartItems).map((item) => {
                const variationUUID = item.variationUUID;

                return (
                  <CartItem
                    key={variationUUID}
                    item={{
                      productUUID: item.productUUID,
                      variationUUID,
                      image: item.image,
                      title: item.title,
                      description: item.specName,
                      salePrice: Number(item.salePrice),
                      retailPrice: Number(item.retailPrice),
                      quantity: Number(item.quantity),
                      purchaseLimit: Number(item.purchaseLimit),
                      tagComboTags: item.tagComboTags,
                      discountReason: item.discountReason,
                    }}
                    calculating={isPriceCalculating}
                    onClickQuantity={(evt, number) => handleOnClickQuantity(evt, variationUUID, number)}
                    onClickRemove={handleRemove}
                  />
                );
              })}
            </div>

            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="sticky top-6 space-y-6">
                <PriceResult
                  onApplyPromoCode={handleClickApplyPromoCode}
                  appliedPromoCode={state.promoCode}
                  priceInfo={state.priceInfo}
                  calculating={isPriceCalculating}
                  onCheckout={handleCheckout}
                />

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                  <h3 className="text-center text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">
                    100% Secure Payment with
                  </h3>
                  <div className="flex justify-center">
                    <PaymentMethods />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Cart;

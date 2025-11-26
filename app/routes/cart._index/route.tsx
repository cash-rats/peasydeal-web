import { useEffect, useMemo, useState } from 'react';
import {
  useFetcher,
  useRouteError,
  isRouteErrorResponse,
} from 'react-router';
import type {
  LinksFunction,
  ShouldRevalidateFunction,
} from 'react-router';
import httpStatus from 'http-status-codes';
import { FcHighPriority } from 'react-icons/fc';
import LoadingBackdrop from '~/components/PeasyDealLoadingBackdrop';
import FiveHundredError from '~/components/FiveHundreError';
import PaymentMethods from '~/components/PaymentMethods';
import ClientOnly from '~/components/ClientOnly';
import { useCartState, useUpdateItemQuantity, useApplyPromoCode } from '~/routes/cart/hooks';

import CartItem from '~/routes/cart/components/Item';
import EmptyShoppingCart from '~/routes/cart/components/EmptyShoppingCart';
import PriceResult from '~/routes/cart/components/PriceResult';
import type { CartPriceResponse } from '~/routes/cart/types';
import sslCheckout from '~/routes/cart/images/SSL-Secure-Connection.png';
import { sortItemsByAddedTime } from '~/routes/cart/utils';
import { round10 } from '~/utils/preciseRound';
import { loadCart as loadCartFromClient } from '~/lib/cartStorage.client';
import { setCartItems, setPriceInfo } from '~/routes/cart/reducer';
import { useRemoveItem } from '~/routes/cart/hooks/useRemoveItem';
import { useCartContext } from '~/routes/hooks';

export const links: LinksFunction = () => [];

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

  // Apply initial price info from /cart/price.
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

      <section className="
				py-0 px-auto
				flex flex-col
				justify-center items-center
				mt-4 md:mt-8
				mx-2 md:mx-4
				bg-[#F7F8FA]
			">
        {
          freeshippingRequiredPrice > 0
            ? (
              <div className="
								w-full py-2.5 max-w-screen-xl mx-auto
								capitalized
								text-lg font-poppins nowrap
								flex
								items-center
								bg-white
								p-4
								rounded-lg border-[2px] border-[#fc1d7a]
							">
                <FcHighPriority fontSize={24} className='w-[36px] mr-4' />
                <span>
                  <b className='text-[#fc1d7a] font-poppins font-bold'>Wait!</b>
                  {` Spend £${round10(freeshippingRequiredPrice, -2)} more to get free shipping`}
                </span>
              </div>
            ) : null
        }
        <div className="w-full py-2.5 max-w-screen-xl mx-auto">
          <div className="flex flex-col">
            <h1 className="
							font-poppins font-semibold
							text-xl md:text-3xl
							mt-6 md:mt-8
							mb-2 md:mb-3
							flex
							items-center
							relative
						">
              <span>Shopping Cart</span>
              <div className="block w-[1px] h-[25px] bg-[#757575] mx-2 md:mx-4" />
              <span className="
								items-center
								font-poppins font-normal
								text-xl md:text-2xl
							">
                {
                  Object.keys(state.cartItems).length > 0 && (
                    <>
                      {Object.keys(state.cartItems).length} {Object.keys(state.cartItems).length > 1 ? 'items' : 'item'}
                    </>
                  )
                }
              </span>
              <img
                src={sslCheckout}
                alt="secure checkout with SSL protection"
                className='h-[42px] md:h-[48px] ml-auto right-0 absolute'
              />
            </h1>

            {/* title row */}
            <div className='flex flex-col md:grid grid-cols-3 gap-4 mt-2 md:mt-6'>
              <div className='col-span-2'>
                <div className="
									w-full h-height
									capitalized
									text-lg font-poppins nowrap
									ml-auto items-center
									bg-white
									p-4
									hidden md:grid grid-cols-12 gap-4
								">
                  <span className="col-span-6 font-medium">
                    Item
                  </span>

                  <span className="col-span-2 text-right font-medium">
                    Price
                  </span>

                  <span className="col-span-2 text-right font-medium">
                    Quantity
                  </span>

                  <span className="col-span-2 text-right font-medium">
                    Total
                  </span>

                </div>
                {
                  sortItemsByAddedTime(state.cartItems)
                    .map((item) => {
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

                      )
                    })
                }
              </div>

              <div className='flex flex-col'>
                <PriceResult
                  onApplyPromoCode={handleClickApplyPromoCode}
                  appliedPromoCode={state.promoCode}
                  priceInfo={state.priceInfo}
                  calculating={isPriceCalculating}
                  onCheckout={handleCheckout}
                />
                <div className='bg-white p-4 mt-4 gap-4'>
                  <h3 className='text-center font-bold'>100% Secure Payment with</h3>
                  <PaymentMethods />
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

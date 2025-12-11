import { useState, useEffect, useCallback } from 'react';
import { FaShippingFast } from 'react-icons/fa';
import { BiCalendarAlt, BiErrorCircle } from 'react-icons/bi';
import parseISO from 'date-fns/parseISO/index.js';
import format from 'date-fns/format/index.js';
import add from 'date-fns/add/index.js';
import type { LinksFunction } from 'react-router';
import { useFetcher, useRevalidator } from 'react-router';
import { useImmerReducer } from 'use-immer';
import { Button } from '~/components/ui/button';

import DeliveryInfo from './components/DeliveryInfo';
import CancelOrderActionBar from './components/CancelOrderActionBar';
import type { CancelReason } from './components/CancelOrderActionBar';
import ReviewModal, { links as ReviewModalLinks } from './components/ReviewModal';
import reducer, {
  TrackingActionTypes,
  reviewOnProduct,
  reset,
} from './reducer';
import type { TrackOrder } from '../../types';
import { OrderStatus } from '../../types';

const parseTrackOrderCreatedAt = (order: TrackOrder): TrackOrder => ({
  ...order,
  parsed_created_at: parseISO(order.created_at)
});

/*
  Design Reference:
    - https://bbbootstrap.com/snippets/ecommerce-product-order-details-tracking-63470618
    - https://www.ownrides.com/search?cities=&country=&days=&page=1&query=

  TODOs:
    - [x] Search order by order number.
    - [ ] Deliver & Tax should have tooltips when hover over the icon.
    - [ ] show payment status.
    - [ ] Hide.
*/

export const links: LinksFunction = () => {
  return [...ReviewModalLinks()];
};

interface TrackingOrderIndexProps {
  orderInfo: TrackOrder;
}

function TrackingOrderIndex({
  orderInfo,
}: TrackingOrderIndexProps) {
  const [state, dispatch] = useImmerReducer(reducer, {
    reviewProduct: null,
    orderInfo: parseTrackOrderCreatedAt(orderInfo),
    error: null,
  });

  const fetcher = useFetcher();
  const revalidator = useRevalidator();
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [isReviewOpen, setReviewOpen] = useState(false);

  const handleConfirm = useCallback(
    (reason: CancelReason | null) => {
      dispatch({
        type: TrackingActionTypes.set_error,
        payload: null,
      });

      fetcher.submit(
        {
          order_uuid: state.orderInfo.order_uuid,
          cancel_reason: reason?.reason || '',
        },
        {
          method: 'post',
          action: '/api/tracking/order-info',
        },
      );
    }, [state.orderInfo]
  );

  const handleClose = (status: string) => {
    dispatch(reset());
    setReviewOpen(false);
    if (status === 'done') {
      revalidator.revalidate();
    }
  };

  const handleOpenReview = () => setReviewOpen(true);


  useEffect(() => {
    if (fetcher.state !== 'idle') return;
    if (typeof fetcher.data === 'undefined') return;

    const errMsg = fetcher.data;

    if (errMsg !== null) {
      dispatch({
        type: TrackingActionTypes.set_error,
        payload: errMsg,
      });

      return;
    }

    // Close modal
    setOpenCancelModal(false);

    // Update `order_status` to be cancelled.
    dispatch({
      type: TrackingActionTypes.update_order_status,
      payload: OrderStatus.Cancelled,
    });

    // Scroll to top so that user can know the updated order status.
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }
  }, [fetcher.state, fetcher.data]);

  useEffect(
    () => {
      dispatch({
        type: TrackingActionTypes.init_order_info,
        payload: parseTrackOrderCreatedAt(orderInfo),
      });
    },
    [orderInfo],
  );

  const prettifyStatus = (status: string) => status ? status.split('_').join(' ') : '';

  return (
    <div className="bg-gray-50">
      {
        <ReviewModal
          isOpen={isReviewOpen}
          onClose={handleClose}
          orderUUID={state.orderInfo.order_uuid}
          reviewProduct={state.reviewProduct}
        />
      }

      <div className="mx-auto max-w-5xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Order ID: <span className="font-mono text-gray-800">{state.orderInfo.order_uuid}</span>
        </h1>

        <div className="space-y-4">
          {/* Cancelled Order warning */}
          {
            state.error
              ? (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  <BiErrorCircle className="mt-0.5 h-5 w-5" />
                  <div className="space-y-1">
                    <p className="text-base font-semibold">There was an error when cancelling this order.</p>
                    <p>
                      {state.error} For further support, contact us at{' '}
                      <a
                        className="font-semibold text-[#D02E7D] underline"
                        href={`mailto:contact@peasydeal.com?subject=Cancelled Order - ${state.orderInfo.order_uuid}`}
                      >
                        contact@peasydeal.com
                      </a>.
                    </p>
                  </div>
                </div>
              )
              : null
          }

          {
            state.orderInfo.order_status === OrderStatus.Cancelled
              ? (
                <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                  <BiErrorCircle className="mt-0.5 h-5 w-5" />
                  <div className="space-y-1">
                    <p className="text-base font-semibold">This order has been cancelled.</p>
                    <p>
                      If payment has been made, it will be refunded. For questions, contact{' '}
                      <a
                        className="font-semibold text-[#D02E7D] underline"
                        href={`mailto:contact@peasydeal.com?subject=Cancelled Order - ${state.orderInfo.order_uuid}`}
                      >
                        contact@peasydeal.com
                      </a>.
                    </p>
                  </div>
                </div>
              )
              : null
          }

          <section className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-8 gap-y-3 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <BiCalendarAlt className="h-4 w-4" />
                <span>
                  Order Date:{' '}
                  <span className="font-medium text-gray-800">
                    {format(state.orderInfo.parsed_created_at, 'MMM d, yyyy')}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaShippingFast className="h-4 w-4 text-green-500" />
                <span>
                  Estimated Delivery:{' '}
                  <span className="font-medium text-gray-800">
                    {format(add(state.orderInfo.parsed_created_at, { days: 10 }), 'MMM d, yyyy')}
                  </span>
                </span>
              </div>
            </div>
          </section>

          <section className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white shadow-sm">
            {
              state
                .orderInfo
                .products
                .map((product) => {
                  const shippingStatus = state.orderInfo.shipping_status || state.orderInfo.order_status;
                  const hasTracking = Boolean(state.orderInfo.tracking_number);
                  const statusColor = state.orderInfo.order_status === OrderStatus.Cancelled
                    ? 'text-red-600'
                    : state.orderInfo.order_status === OrderStatus.Complete
                      ? 'text-green-600'
                      : 'text-amber-600';

                  return (
                    <div
                      key={`tracking_item_${product.uuid}`}
                      className="flex flex-col gap-6 p-6 sm:flex-row"
                    >
                      <img
                        alt={product.title}
                        src={product.url}
                        className="h-24 w-24 flex-shrink-0 rounded-lg object-cover"
                      />

                      <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <p className="text-lg font-semibold text-gray-900">{product.title}</p>
                          <p className="text-sm text-gray-500">{product.spec_name}</p>
                          <div className="space-y-1 text-sm text-gray-600">
                            {
                              hasTracking
                                ? (
                                  <>
                                    <p>
                                      Shipping Vendor:{' '}
                                      <span className="font-medium text-gray-900">{state.orderInfo.carrier || 'N/A'}</span>
                                    </p>
                                    <p>
                                      Tracking Number:{' '}
                                      {
                                        state.orderInfo.tracking_link
                                          ? (
                                            <a
                                              className="font-semibold text-[#6366f1] hover:underline"
                                              href={state.orderInfo.tracking_link}
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              {state.orderInfo.tracking_number}
                                            </a>
                                          )
                                          : (
                                            <span className="font-medium text-gray-900">
                                              {state.orderInfo.tracking_number}
                                            </span>
                                          )
                                      }
                                    </p>
                                  </>
                                )
                                : null
                            }
                            <p>
                              Status:{' '}
                              <span className={`font-semibold capitalize ${statusColor}`}>
                                {prettifyStatus(shippingStatus)}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-shrink-0 flex-col items-start gap-1 sm:items-end">
                          <p className="text-lg font-semibold text-gray-900">£{product.sale_price}</p>
                          <p className="text-sm text-gray-500">Qty: {product.order_quantity}</p>

                          {
                            product.can_review
                              ? (
                                <Button
                                  variant='ghost'
                                  className='mt-1 h-auto p-0 text-sm font-semibold text-[#1DA1F2] hover:text-[#0d8ddb]'
                                  onClick={() => {
                                    dispatch(reviewOnProduct(product));
                                    handleOpenReview();
                                  }}
                                >
                                  Review
                                </Button>
                              )
                              : null
                          }
                        </div>
                      </div>
                    </div>
                  )
                })
            }
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
              <DeliveryInfo orderInfo={state.orderInfo} />
            </section>

            <section className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">Order Summary</h2>
              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span>Subtotal (VAT incl.)</span>
                  <span className="font-medium">£{state.orderInfo.subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-medium">+ £{state.orderInfo.shipping_fee}</span>
                </div>
                {
                  state.orderInfo.tax_amount
                    ? (
                      <div className="flex items-center justify-between">
                        <span>Tax</span>
                        <span className="font-medium">£{state.orderInfo.tax_amount}</span>
                      </div>
                    )
                    : null
                }
                {
                  state.orderInfo.discount_amount
                    ? (
                      <div className="flex items-center justify-between text-gray-600">
                        <span>Discounts</span>
                        <span className="font-medium">- £{state.orderInfo.discount_amount}</span>
                      </div>
                    )
                    : null
                }
                <div className="my-2 border-t border-gray-200" />
                <div className="flex items-center justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>£{state.orderInfo.total_amount}</span>
                </div>
              </div>
            </section>
          </div>

          {
            state.orderInfo.order_status !== OrderStatus.Cancelled
              ? (
                <div className="flex justify-end">
                  <CancelOrderActionBar
                    onConfirm={handleConfirm}
                    openCancelModal={openCancelModal}
                    onOpen={() => setOpenCancelModal(true)}
                    onClose={() => setOpenCancelModal(false)}
                    isLoading={fetcher.state !== 'idle'}
                  />
                </div>
              )
              : null
          }
        </div>
      </div>
    </div>
  );
}

export default TrackingOrderIndex;

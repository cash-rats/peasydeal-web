import { useState, useEffect, useCallback } from 'react';
import { BiCalendarAlt, BiErrorCircle } from 'react-icons/bi';
import parseISO from 'date-fns/parseISO/index.js';
import format from 'date-fns/format/index.js';
import add from 'date-fns/add/index.js';
import type { LinksFunction } from 'react-router';
import { useFetcher, useRevalidator } from 'react-router';
import { useImmerReducer } from 'use-immer';
import { Badge } from '~/components/v2/Badge';
import type { BadgeProps } from '~/components/v2/Badge';

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

const statusBadgeMap: Record<OrderStatus, { variant: BadgeProps['variant']; label: string }> = {
  [OrderStatus.OrderReceived]: { variant: 'limited', label: 'Order Received' },
  [OrderStatus.Processing]: { variant: 'hot', label: 'Processing' },
  [OrderStatus.Complete]: { variant: 'discount', label: 'Completed' },
  [OrderStatus.Cancelled]: { variant: 'new', label: 'Cancelled' },
  [OrderStatus.Hold]: { variant: 'hot', label: 'On Hold' },
};

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
    }, [dispatch, fetcher, state.orderInfo]
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
  }, [dispatch, fetcher.state, fetcher.data]);

  useEffect(
    () => {
      dispatch({
        type: TrackingActionTypes.init_order_info,
        payload: parseTrackOrderCreatedAt(orderInfo),
      });
    },
    [dispatch, orderInfo],
  );

  const prettifyStatus = (status: string) => status ? status.split('_').join(' ') : '';
  const orderStatusBadge = statusBadgeMap[state.orderInfo.order_status] || {
    variant: 'limited',
    label: prettifyStatus(state.orderInfo.order_status),
  };
  const orderDate = format(state.orderInfo.parsed_created_at, 'MMM d, yyyy');
  const estimatedDeliveryDate = format(add(state.orderInfo.parsed_created_at, { days: 10 }), 'MMM d, yyyy');

  return (
    <div className="v2 bg-rd-bg-primary">
      {
        <ReviewModal
          isOpen={isReviewOpen}
          onClose={handleClose}
          orderUUID={state.orderInfo.order_uuid}
          reviewProduct={state.reviewProduct}
        />
      }

      <div className="mx-auto max-w-[800px] px-[var(--container-padding)] py-12">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-6 rounded-rd-md bg-rd-bg-card p-8">
          <div>
            <p className="font-body text-[13px] font-medium uppercase tracking-[0.5px] text-rd-text-secondary">
              Order
            </p>
            <p className="mt-1 font-heading text-2xl font-bold text-black">
              {state.orderInfo.order_uuid}
            </p>
            <div className="mt-3 flex flex-col gap-1 text-sm text-rd-text-body">
              <p className="flex items-center gap-2">
                <BiCalendarAlt className="h-4 w-4" />
                Ordered {orderDate}
              </p>
              <p>Est. delivery: {estimatedDeliveryDate}</p>
            </div>
          </div>

          <Badge variant={orderStatusBadge.variant}>
            {orderStatusBadge.label}
          </Badge>
        </div>

        <div>
          {
            state.error
              ? (
                <div className="mb-6 flex items-start gap-2.5 rounded-rd-sm border border-[#FECACA] bg-[#FEF2F2] px-4 py-3.5 text-sm text-[#991B1B]">
                  <BiErrorCircle className="mt-0.5 h-5 w-5" />
                  <div className="space-y-1 font-body">
                    <p className="font-semibold">There was an error when cancelling this order.</p>
                    <p className="leading-relaxed">
                      {state.error} For further support, contact us at{' '}
                      <a
                        className="text-black underline underline-offset-2"
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
                <div className="mb-6 flex items-start gap-2.5 rounded-rd-sm border border-[#FECACA] bg-[#FEF2F2] px-4 py-3.5 text-sm text-[#991B1B]">
                  <BiErrorCircle className="mt-0.5 h-5 w-5" />
                  <div className="space-y-1 font-body">
                    <p className="font-semibold">This order has been cancelled.</p>
                    <p className="leading-relaxed">
                      If payment has been made, it will be refunded. For questions, contact{' '}
                      <a
                        className="text-black underline underline-offset-2"
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

          <section className="mb-8 overflow-hidden rounded-rd-md border border-rd-border-light">
            {
              state
                .orderInfo
                .products
                .map((product) => {
                  const hasVendorAndNumber = Boolean(product.carrier && product.tracking_number);
                  const hasTrackingAll = Boolean(
                    hasVendorAndNumber
                    && product.tracking_link
                  );
                  const shippingStatus =
                    state.orderInfo.order_status === OrderStatus.Cancelled
                      ? OrderStatus.Cancelled
                      : hasVendorAndNumber
                        ? 'shipped'
                        : OrderStatus.Processing;
                  const statusColor =
                    shippingStatus === 'shipped' || state.orderInfo.order_status === OrderStatus.Complete
                      ? 'text-[#4A7C59]'
                      : state.orderInfo.order_status === OrderStatus.Cancelled
                        ? 'text-[#C75050]'
                        : 'text-rd-text-body';

                  return (
                    <div
                      key={`tracking_item_${product.uuid}`}
                      className="flex items-center gap-4 border-b border-[#F0F0F0] px-5 py-4 last:border-b-0"
                    >
                      <img
                        alt={product.title}
                        src={product.url}
                        className="h-16 w-16 flex-shrink-0 rounded-rd-sm bg-rd-bg-card object-cover"
                      />

                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="font-body text-sm font-medium text-black">
                          {product.title}
                        </p>
                        <p className="mt-0.5 font-body text-[13px] text-rd-text-muted">
                          {product.spec_name}
                        </p>
                        <p className="mt-0.5 font-body text-[13px] text-rd-text-secondary">
                          Qty: {product.order_quantity}
                        </p>

                        <div className="mt-1 space-y-1 font-body text-[13px] text-rd-text-body">
                          <p>
                            Status:{' '}
                            <span className={`font-medium capitalize ${statusColor}`}>
                              {prettifyStatus(shippingStatus)}
                            </span>
                          </p>

                          {hasVendorAndNumber ? (
                            <p>
                              Tracking:{' '}
                              {hasTrackingAll ? (
                                <a
                                  className="underline underline-offset-2"
                                  href={product.tracking_link}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {product.tracking_number}
                                </a>
                              ) : (
                                <span>{product.tracking_number}</span>
                              )}
                              {product.carrier ? ` (${product.carrier})` : ''}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="ml-4 text-right">
                        <p className="font-body text-sm font-semibold text-black">£{product.sale_price}</p>
                        {
                          product.can_review
                            ? (
                              <button
                                type="button"
                                className="mt-1 font-body text-[13px] text-black underline underline-offset-[3px]"
                                onClick={() => {
                                  dispatch(reviewOnProduct(product));
                                  handleOpenReview();
                                }}
                              >
                                Review
                              </button>
                            )
                            : null
                        }
                      </div>
                    </div>
                  )
                })
            }
          </section>

          <div className="space-y-8">
            <DeliveryInfo orderInfo={state.orderInfo} />

            <section className="rounded-rd-md border border-rd-border-light p-6">
              <h2 className="mb-5 font-body text-sm font-semibold uppercase tracking-[0.5px] text-black">
                Order Summary
              </h2>
              <div className="font-body text-sm">
                <div className="flex justify-between py-2">
                  <span className="text-rd-text-body">Subtotal (VAT incl.)</span>
                  <span className="font-medium text-black">£{state.orderInfo.subtotal}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-rd-text-body">Shipping Fee</span>
                  <span className="font-medium text-black">£{state.orderInfo.shipping_fee}</span>
                </div>
                {
                  state.orderInfo.tax_amount > 0
                    ? (
                      <div className="flex justify-between py-2">
                        <span className="text-rd-text-body">Tax</span>
                        <span className="font-medium text-black">£{state.orderInfo.tax_amount}</span>
                      </div>
                    )
                    : null
                }
                {
                  state.orderInfo.discount_amount > 0
                    ? (
                      <div className="flex justify-between py-2">
                        <span className="text-rd-text-body">Discount</span>
                        <span className="font-medium text-black">- £{state.orderInfo.discount_amount}</span>
                      </div>
                    )
                    : null
                }
                <div className="mt-2 border-t border-rd-border-light pt-3">
                  <div className="flex justify-between py-1">
                    <span className="text-base font-bold text-black">Total</span>
                    <span className="text-base font-bold text-black">£{state.orderInfo.total_amount}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {
            state.orderInfo.order_status !== OrderStatus.Cancelled
              && state.orderInfo.order_status !== OrderStatus.Complete
              ? (
                <div className="mt-2">
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

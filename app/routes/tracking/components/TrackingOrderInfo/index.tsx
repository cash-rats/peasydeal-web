import { useState, useEffect, useCallback } from 'react';
import { FaShippingFast } from 'react-icons/fa';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import add from 'date-fns/add';
import { Tooltip } from '@chakra-ui/react'
import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { useImmerReducer } from 'use-immer';
import { FcInfo } from 'react-icons/fc';

import PriceInfo from './components/PriceInfo';
import DeliveryInfo from './components/DeliveryInfo';
import CancelOrderActionBar from './components/CancelOrderActionBar';
import type { CancelReason } from './components/CancelOrderActionBar';
import { cancelOrder } from './api.server';
import reducer, { TrackingActionTypes } from './reducer';
import type { TrackOrder } from '../../types';
import { OrderStatus } from '../../types';

const parseTrackOrderCreatedAt = (order: TrackOrder): TrackOrder => {
  order.parsed_created_at = parseISO(order.created_at);
  return order;
};

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

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const formEntries = Object.fromEntries(form.entries());


  try {
    await cancelOrder({
      orderUUID: formEntries['order_uuid'] as string,
      cancelReason: formEntries['cancel_reason'] as string,
    });

    return null
  } catch (err) {
    throw json(err);
  }
};

interface TrackingOrderIndexProps {
  orderInfo: TrackOrder;
}

function TrackingOrderIndex({ orderInfo }: TrackingOrderIndexProps) {
  const [state, dispatch] = useImmerReducer(reducer, {
    orderInfo: parseTrackOrderCreatedAt(orderInfo),
  });

  const fetcher = useFetcher();
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const handleConfirm = useCallback(
    (reason: CancelReason | null) => {
      fetcher.submit(
        {
          order_uuid: state.orderInfo.order_uuid,
          cancel_reason: reason?.reason || '',
        },
        {
          method: 'post',
          action: '/tracking/components/TrackingOrderInfo?index',
        },
      );
    }, [state.orderInfo]
  );


  useEffect(() => {
    if (fetcher.type === 'done') {
      // Close modal
      setOpenCancelModal(false);

      // Update `order_status` to be cancelled.
      dispatch({
        type: TrackingActionTypes.update_order_status,
        payload: OrderStatus.Cancelled,
      });

      // Scroll to top so that user can know the updated order status.
      if (window) {
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      }
    }
  }, [fetcher.type]);

  return (
    <div className="max-w-[1180px] my-0 mx-auto pt-4 pr-1 pb-12 pl-4">
      <h1 className="font-poppins font-bold text-2xl leading-[1.875rem] mb-4">
        Order ID: {state.orderInfo.order_uuid}
      </h1>

      <div className="flex mb-4">
        <span className="
          flex font-poppins text-sm text-battleship-grey
          first:pr-4 last:pl-4 text-[rbg(0,179,59)]
          border-r-[2px] capitalize"
        >
          Order date: &nbsp; <b>{format(state.orderInfo.parsed_created_at, 'MMM, d, yyyy')}</b>
        </span>

        <span className="
          flex text-sm text-battleship-grey
          first:pr-4 first:border-solid first:border-[1px] first:border-border-color
          last:pl-4 text-[rbg(0,179,59)]
          font-poppins capitalize
        ">
          {/* Estimated delivery would be 10 days after order is made */}
          <FaShippingFast fontSize={20} color='#00b33b' /> &nbsp;
          Estimated delivery: &nbsp;
          <b>
            {
              format(
                add(state.orderInfo.parsed_created_at, { days: 10 }),
                'MMM, d, yyyy'
              )
            }
          </b>
        </span>
      </div>

      {/* Cancelled Order warning */}

      {
        state.orderInfo.order_status === OrderStatus.Cancelled
          ? (

            <div className="
								w-full py-2.5 max-w-screen-xl mx-auto
								capitalized
								text-lg font-poppins nowrap
								flex
								items-center
								bg-white
								p-4
								rounded-lg border-[2px] border-[#4880C8]
							">
              <FcInfo
                fontSize={24}
                className='w-[36px] mr-4'
              />
              <span>
                <b className='text-[#4880C8] font-poppins font-bold'>
                  This order has been cancelled
                </b>
                <p className="font-poppins text-sm">
                  If payment has been made, it will be refunded.
                  For further questions, please let us know via email: &nbsp;
                  <span className="text-[#D02E7D]">
                    <a href={`mailto:contact@peasydeal.com?subject=Cancelled Order - ${state.orderInfo.order_uuid}`}>
                      contact@peasydeal.com
                    </a>
                  </span>.
                </p>
              </span>
            </div>
          )
          : null
      }

      {/* Products */}
      <div className="
        border-[1px] border-solid border-border-color
        py-4 px-0 flex flex-col gap-4 my-4 bg-white
      ">
        {
          state
            .orderInfo
            .products
            .map((product) => {
              return (
                <div
                  key={`tracking_item_${product.uuid}`}
                  className="
                w-full flex flex-row justify-between
                items-center pt-0 px-4 pb-4 border-b-[1px]
                border-solid border-border-color
                last:border-b-0 last:pb-0
                font-poppins
              ">
                  <div className="w-[70%] flex flex-row justify-start items-center">
                    <div className="mr-3">
                      <img
                        alt={product.title}
                        src={product.url}
                        className="w-[75px] h-[75px]"
                      />
                    </div>

                    <div>
                      <p className="text-base font-medium"> {product.title} </p>
                      <p className="text-xs font-normal text-[rgb(130,129,131)]"> {product.spec_name} </p>
                    </div>
                  </div>

                  <div className="w-[30%] flex justify-end">
                    <div className="flex flex-col items-end">
                      <p className="text-xl font-medium">
                        £{product.sale_price}
                      </p>
                      <p className="text-base font-normala text-[rgb(130,129,131)]">
                        Qty: {product.order_quantity}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
        }
      </div>

      {/* Delivery */}
      <DeliveryInfo orderInfo={state.orderInfo} />

      {/* Order Summary  */}
      <div className="p-4 border-[1px] bg-white">
        <h1 className="font-poppins text-[1.2rem] font-normal mb-[0.7rem]"> Order Summary </h1>
        <PriceInfo
          title={(
            <span className="font-poppins text-base text-black capitalize">
              subtotal &nbsp;
            </span>
          )}
          priceInfo={(
            <span className="font-poppins text-base font-normal text-black text-right">
              £{state.orderInfo.subtotal}
            </span>
          )}
        />

        <div className="mt-2 border-b-[1px] border-border-color pb-4 flex flex-col gap-[0.3rem]">
          <PriceInfo
            title='Shipping Fee'
            priceInfo={`+ £${state.orderInfo.shipping_fee}`}
          />

          <PriceInfo
            title={(
              <span className="flex flex-row items-center">
                <span className="font-poppins mr-1">
                  Tax
                </span>
                <Tooltip title="20% VAT" hasArrow>
                  <span>
                    <BsFillInfoCircleFill />
                  </span>
                </Tooltip>
              </span>
            )}
            priceInfo={`+ £${state.orderInfo.tax_amount}`}
          />
        </div>

        <div className="flex mt-2">
          <p className="flex-1 font-poppins"> Total </p>
          <p className="flex justify-end font-medium text-base font-poppins">
            £{state.orderInfo.total_amount}
          </p>
        </div>
      </div>

      {
        state.orderInfo.order_status !== OrderStatus.Cancelled
          ? (
            <CancelOrderActionBar
              onConfirm={handleConfirm}
              openCancelModal={openCancelModal}
              onOpen={() => setOpenCancelModal(true)}
              onClose={() => setOpenCancelModal(false)}
              isLoading={fetcher.state !== 'idle'}
            />
          )
          : null

      }
    </div >
  );
}

export default TrackingOrderIndex;
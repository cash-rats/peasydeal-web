import { FaShippingFast } from 'react-icons/fa';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import add from 'date-fns/add';
import Tooltip from '@mui/material/Tooltip';
import Image from 'remix-image';

import PriceInfo from './components/PriceInfo';
import DeliveryInfo from './components/DeliveryInfo';
import type { TrackOrder } from '../../types';


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

interface TrackingOrderIndexProps {
  orderInfo: TrackOrder;
}

function TrackingOrderIndex({ orderInfo }: TrackingOrderIndexProps) {
  orderInfo = parseTrackOrderCreatedAt(orderInfo);


  return (
    <div className="max-w-[1180px] my-0 mx-auto pt-4 pr-1 pb-12 pl-4">
      <h1 className="font-bold text-2xl leading-[1.875rem] mb-4">
        Order ID: {orderInfo.order_uuid}
      </h1>

      <div className="flex mb-4">
        <span className="flex text-sm text-battleship-grey
          first:pr-4 last:pl-4 text-[rbg(0,179,59)]
          border-r-"
        >
          Order date: &nbsp; <b>{format(orderInfo.parsed_created_at, 'MMM, d, yyyy')}</b>
        </span>

        <span className="flex text-sm text-battleship-grey
        first:pr-4 first:border-solid first:border-[1px] first:border-border-color
        last:pl-4 text-[rbg(0,179,59)]
      ">
          {/* Estimated delivery would be 10 days after order is made */}
          <FaShippingFast fontSize={20} color='#00b33b' /> &nbsp;
          Estimated delivery: &nbsp;
          <b>
            {
              format(
                add(orderInfo.parsed_created_at, { days: 10 }),
                'MMM, d, yyyy'
              )
            }
          </b>
        </span>
      </div>

      {/* Products */}
      {/* <div className="order-products-container"> */}
      <div className="border-[1px] border-solid border-border-color py-4 px-0 flex flex-col gap-4 mb-4 bg-white">
        {
          orderInfo.products.map((product) => {
            console.log('debug product', product.url)
            return (

              <div
                key={product.uuid}
                className="w-full flex flex-row justify-between
              items-center pt-0 px-4 pb-4 border-b-[1px]
              border-solid border-border-color
              last:border-b-0 last:pb-0"

              >
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
      <DeliveryInfo orderInfo={orderInfo} />

      {/* Order Summary  */}
      <div className="p-4 border-[1px] border-b-0 bg-white">
        <h1 className="text-[1.2rem] font-normal mb-[0.7rem]"> Order Summary </h1>
        <PriceInfo
          title={(
            <span className="text-base text-black capitalize">
              subtotal &nbsp;
            </span>
          )}
          priceInfo={(
            <p className="mt-2">
              <span className="text-base font-normal text-black">
                £{orderInfo.subtotal} &nbsp;
              </span>
              <span className="uppercase  text-[rgb(0,179,59)] text-base font-medium ">
                Saved ${orderInfo.discount_amount} !
              </span>
            </p>
          )}
        />

        <div className="mt-2 border-b-[1px] border-border-color pb-4 flex flex-col gap-[0.3rem]">
          <PriceInfo
            title='Shipping Fee'
            priceInfo={`+ £${orderInfo.shipping_fee}`}
          />

          <PriceInfo
            title={(
              <span className="flex flex-row items-center">
                <span className="mr-1">
                  Tax
                </span>
                <Tooltip title="20% VAT" arrow>
                  <span>
                    <BsFillInfoCircleFill />
                  </span>
                </Tooltip>
              </span>
            )}
            priceInfo={`+ £${orderInfo.tax_amount}`}
          />
        </div>

        <div className="flex mt-2">
          <p className="flex-1"> Total </p>
          <p className="flex justify-end font-medium text-base"> £{orderInfo.total_amount} </p>
        </div>
      </div>
    </div >
  );
}

export default TrackingOrderIndex;
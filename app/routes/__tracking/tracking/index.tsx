import { useState, useEffect } from 'react';
import type { LinksFunction, LoaderFunction, ErrorBoundaryComponent } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useFetcher, useCatch } from '@remix-run/react';
import { FaShippingFast } from 'react-icons/fa';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import httpStatus from 'http-status-codes';

import { useOrderNum } from '~/routes/__tracking';
import { error } from '~/utils/error';

import styles from './styles/Tracking.css';
import { trackOrder } from './api';
import EmptyBox from './images/empty-box.png';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const hasOrderID = url.searchParams.has('order_id')

  // Current route has just been requested. Ask user to search order by order ID.
  if (!hasOrderID) {
    return json({ order: null }, httpStatus.OK)
  }

  const orderID = url.searchParams.get('order_id') || '';


  console.log('debug 1', orderID);

  // Order id is likely to be empty, thus, is invalid.
  if (!orderID) {
    return json(error('invalid order id'), httpStatus.BAD_REQUEST);
  }

  // TODO check order id format before sending to backend.
  const resp = await trackOrder(orderID);
  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    throw json(respJSON, resp.status);
  }

  console.log('debug 2', resp.status);
  console.log('debug 3', orderID);

  return null;
}

export function ErrorBoundary({ error }) {
  // const caught = useCatch();
  console.log('ErrorBoundary', error);
  return (
    <div className="order-not-found">
      <img
        alt="no data found"
        src={EmptyBox}
      />

      <p> wrong order id maybe? </p>
    </div>
  )
}


/*
  Design Reference:
    - https://bbbootstrap.com/snippets/ecommerce-product-order-details-tracking-63470618
    - https://www.ownrides.com/search?cities=&country=&days=&page=1&query=

  TODOs:
    - [ ] Search order by order number.
    - [ ] Deliver & Tax should have tooltips when hover over the icon.
*/
function TrackingOrderIndex() {
  const { orderNum } = useOrderNum();
  const [orderInfo, setOrderInfo] = useState<{} | null>(null);
  const trackOrder = useFetcher();

  console.log('debug 3', orderNum);

  // Search when `orderNum` is changed.
  useEffect(() => {
    console.log('debug fe', orderNum);
    if (!orderNum) return;
    trackOrder.load(`/tracking?index&order_id=${orderNum}`);
  }, [orderNum]);

  // useEffect(() => {
  //   console.log('fetcher data', trackOrder.);
  // }, [trackOrder])

  return (
    <div className="tracking-order-container">
      <h1 className="order-title"> Order ID: 33492461 </h1>

      <div className="order-subtitle">
        <span className="order-subtitle-info">
          Order date: &nbsp; <b>Feb, 16, 2022</b>
        </span>
        <span className="order-subtitle-info">
          <FaShippingFast fontSize={20} color='#00b33b' /> &nbsp;
          Estimated delivery: &nbsp; <b>May 14, 2022</b>
        </span>
      </div>

      {/* Products */}
      <div className="order-products-container">

        <div className="order-product">

          <div className="left">
            <div className="product-img">

              <img
                alt='product'
                src='https://via.placeholder.com/150'
              />
            </div>

            <div className="product-spec-info">
              <p className="product-name"> MacBook Pro 14 </p>
              <p className="product-spec">Space Gray 32GB 1TB</p>
            </div>
          </div>

          <div className="right">
            <div className="price-qty">
              <p>$2599</p>
              <p>Qty: 1</p>
            </div>
          </div>
        </div>

        <div className="order-product">

          <div className="left">
            <div className="product-img">

              <img
                alt='product'
                src='https://via.placeholder.com/150'
              />
            </div>

            <div className="product-spec-info">
              <p className="product-name"> MacBook Pro 14 </p>
              <p className="product-spec">Space Gray 32GB 1TB</p>
            </div>
          </div>

          <div className="right">
            <div className="price-qty">
              <p>$2599</p>
              <p>Qty: 1</p>
            </div>
          </div>

        </div>
      </div>

      {/* Delivery */}
      <div className="deliver-info-container ">
        <h1>Delivery</h1>

        <div className="info-piece">
          <h4>Address</h4>
          <p>
            Mrs Smith 71 Cherry Court SOUTHAMPTON SO53 5PD UK
          </p>
        </div>

        <div className="info-piece">
          <h4>Delivery method</h4>
          <p>
            Free (30 day)
          </p>
        </div>
      </div>

      {/* Order Summary  */}
      <div className="deliver-info-container ">
        <h1> Order Summary </h1>

        <div className="subtotal">
          <p>Subtotal</p>
          <p>$5547</p>
        </div>

        <div className="cost-info-box info-piece">
          <span className="price-info">
            <p> Discount </p>
            <p> - $1109.40 </p>
          </span>

          <span className="price-info">
            <span className="title-with-info">
              <p> Deliver </p>
              <BsFillInfoCircleFill />
            </span>
            <p> $20.00 </p>
          </span>

          <span className="price-info">
            <span className="title-with-info">
              <p> Tax </p>
              <span>
                <BsFillInfoCircleFill />
              </span>
            </span>

            <p> + $221.88 </p>
          </span>
        </div>

        <div className="total">
          <p> Total </p>
          <p> $4659.48 </p>
        </div>
      </div>
    </div >
  );
}

export default TrackingOrderIndex;
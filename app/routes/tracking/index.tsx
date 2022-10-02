import { useState, useEffect } from 'react';
import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { FaShippingFast } from 'react-icons/fa';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import httpStatus from 'http-status-codes';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import add from 'date-fns/add';

import { useOrderNum } from '~/routes/tracking';
import { error } from '~/utils/error';
import type { ApiErrorResponse } from '~/shared/types';

import styles from './styles/Tracking.css';
import { trackOrder } from './api';
import EmptyBox from './images/empty-box.png';
import type { TrackOrder } from './types';
import { ProductDetailCarousel } from '~/components/Carousel/Carousel.stories';

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

  // Order id is likely to be empty, thus, is invalid.
  if (!orderID) {
    return json(error('invalid order id'), httpStatus.BAD_REQUEST);
  }

  // TODO check order id format before sending to backend.
  const resp = await trackOrder(orderID);
  const respJSON = await resp.json() as TrackOrder;

  if (resp.status !== httpStatus.OK) {
    return json(respJSON, resp.status)
  }

  return json<TrackOrder>(respJSON, httpStatus.OK);
}

function TrackingOrderErrorPage() {
  return (
    <div className="problematic-page">
      <img
        alt="no data found"
        src={EmptyBox}
      />

      <p> wrong order id maybe? </p>
    </div>
  );
}

function InitialPage() {
  return (
    <div className="problematic-page">
      <p> Please prompt order id above to track for your order. </p>
    </div>
  );
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
  const [error, setError] = useState<null | ApiErrorResponse>(null);
  const [orderInfo, setOrderInfo] = useState<TrackOrder | null>(null);
  const trackOrder = useFetcher();

  // Search when `orderNum` is changed.
  useEffect(() => {
    if (!orderNum) return;
    setError(null);
    trackOrder.load(`/tracking?index&order_id=${orderNum}`);
  }, [orderNum]);

  useEffect(() => {
    if (trackOrder.type === 'done') {
      // If is an error, set error state to display error page.
      if (trackOrder.data.hasOwnProperty('err_code')) {
        setError(trackOrder.data);

        return;
      }

      let orderInfo = trackOrder.data as TrackOrder;
      orderInfo.parsed_created_at = parseISO(orderInfo.created_at);
      setOrderInfo(trackOrder.data);
      // If there isn't any error, display tracking order information
    }
  }, [trackOrder])

  if (error) {
    return (<TrackingOrderErrorPage />);
  }

  // Initial state when nothing is being searched. Ask user to prompot order uuid to search.
  if (!orderInfo) {
    return (
      <InitialPage />
    );
  }

  return (
    <div className="tracking-order-container">
      <h1 className="order-title">
        Order ID: {orderInfo.order_uuid}
      </h1>

      <div className="order-subtitle">
        <span className="order-subtitle-info">
          Order date: &nbsp; <b>{format(orderInfo.parsed_created_at, 'MMM, d, yyyy')}</b>
        </span>

        <span className="order-subtitle-info">
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
      <div className="order-products-container">
        {
          orderInfo.products.map((product) => (
            <div
              key={product.uuid}
              className="order-product"
            >
              <div className="left">
                <div className="product-img">
                  <img
                    alt={product.title}
                    src={product.url}
                  />
                </div>

                <div className="product-spec-info">
                  <p className="product-name"> {product.title} </p>
                  <p className="product-spec"> {product.spec_name} </p>
                </div>
              </div>

              <div className="right">
                <div className="price-qty">
                  <p>{product.sale_price}</p>
                  <p>Qty: {product.order_quantity}</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>

      {/* Delivery */}
      <div className="deliver-info-container ">
        <h1>Delivery</h1>

        <div className="info-piece">
          <h4>Contact Name</h4>
          <p>
            {orderInfo.contact_name}
          </p>

          <h4>Address</h4>

          {/*
              UK address example format:

                Mrs Smith 71 Cherry Court SOUTHAMPTON SO53 5PD UK
            */}
          <p>
            {orderInfo.address} &nbsp;
            {orderInfo.address2} <br />
            {orderInfo.city} <br />
            {orderInfo.postalcode}<br />
            {orderInfo.country}
          </p>
        </div>

        <div className="info-piece">
          <h4>Shipping Status</h4>
          <p>
            {orderInfo.shipping_status}
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
            <p> - ${orderInfo.discount_amount} </p>
          </span>

          <span className="price-info">
            <span className="title-with-info">
              <p> Shipping Fee </p>
              <BsFillInfoCircleFill />
            </span>
            <p> + ${orderInfo.shipping_fee} </p>
          </span>

          <span className="price-info">
            <span className="title-with-info">
              <p> Tax </p>
              <span>
                <BsFillInfoCircleFill />
              </span>
            </span>

            <p> + ${orderInfo.tax_amount} </p>
          </span>
        </div>

        <div className="total">
          <p> Total </p>
          <p> ${orderInfo.total_amount} </p>
        </div>
      </div>
    </div >
  );
}

export default TrackingOrderIndex;
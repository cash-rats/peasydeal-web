import { useEffect, useState } from 'react';
import type { LinksFunction, LoaderFunction, ActionFunction, ErrorBoundaryComponent } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { FaShippingFast } from 'react-icons/fa';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import httpStatus from 'http-status-codes';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import add from 'date-fns/add';

import { useOrderNum } from '~/routes/tracking';
import { error } from '~/utils/error';

import styles from './styles/Tracking.css';
import { trackOrder } from './api';
import EmptyBox from './images/empty-box.png';
import type { TrackOrder } from './types';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

type LoaderDataType = { order: TrackOrder | null };

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const hasOrderID = url.searchParams.has('order_id')

  // Current route has just been requested. Ask user to search order by order ID.
  if (!hasOrderID) {
    return json<LoaderDataType>({ order: null }, httpStatus.OK)
  }

  const orderID = url.searchParams.get('order_id') || '';

  // Order id is likely to be empty, thus, is invalid.
  if (!orderID) {
    return json(error('invalid order id'), httpStatus.BAD_REQUEST);
  }

  // TODO check order id format before sending to backend.
  const resp = await trackOrder(orderID);
  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    throw new Error('no order found');
  }

  const orderInfo = respJSON as TrackOrder

  return json<LoaderDataType>({ order: orderInfo }, httpStatus.OK);
}

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const orderUUID = body.get('order_id') as string || '';

  if (!orderUUID) {
    return redirect('/tracking');
  }

  return redirect(`/tracking?order_id=${orderUUID}`);
}

function TrackingOrderErrorPage() {
  const [orderID, setOrderID] = useState('');
  const { orderNum } = useOrderNum();
  const trackOrder = useFetcher();

  useEffect(() => {

    trackOrder.submit(
      { order_id: orderNum },
      {
        method: 'post',
        action: '/tracking?index',
      },
    );
  }, [orderNum]);

  useEffect(() => {
    if (!window) return;
    const params = (new URLSearchParams(window.location.search));

    if (!params.has('order_id')) return;
    const orderID = params.get('order_id');

    if (!orderID) return;
    setOrderID(orderID);

  }, [orderID]);

  return (
    <div className="problematic-page">
      <p className="error-text"> Result for order {orderID} is not found </p>

      <div className="error-content">
        <img
          alt="no data found"
          src={EmptyBox}
        />
      </div>
    </div>
  );
}

function InitialPage() {
  return (
    <div className="initial-page">
      <p className='error-text'> Search your order with order id. </p>
    </div>
  );
}

const parseTrackOrderCreatedAt = (order: TrackOrder): TrackOrder => {
  order.parsed_created_at = parseISO(order.created_at);
  return order;
};

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (<TrackingOrderErrorPage />);
}

/*
  Design Reference:
    - https://bbbootstrap.com/snippets/ecommerce-product-order-details-tracking-63470618
    - https://www.ownrides.com/search?cities=&country=&days=&page=1&query=

  TODOs:
    - [x] Search order by order number.
    - [ ] Deliver & Tax should have tooltips when hover over the icon.
*/

interface TrackingOrderIndexProps {
  error: Error | null
}

function TrackingOrderIndex({ error }: TrackingOrderIndexProps) {
  const { orderNum } = useOrderNum();
  let orderInfo = useLoaderData<LoaderDataType | null>();

  if (orderInfo && orderInfo.order) {
    orderInfo.order = parseTrackOrderCreatedAt(orderInfo.order);
  }

  const trackOrder = useFetcher();

  // Search when `orderNum` is changed.
  useEffect(() => {
    console.log('debug 1', orderNum);
    console.log('debug 2', orderNum === '');

    // If `orderNum` is an empty string, redirect user to initial page.
    trackOrder.submit(
      { order_id: orderNum },
      {
        method: 'post',
        action: '/tracking?index',
      },
    );
  }, [orderNum]);

  // Initial state when nothing is being searched. Ask user to prompot order uuid to search.
  if (!orderInfo || !orderInfo.order) {
    return (
      <InitialPage />
    );
  }

  const { order } = orderInfo;

  return (
    <div className="tracking-order-container">
      <h1 className="order-title">
        Order ID: {order.order_uuid}
      </h1>

      <div className="order-subtitle">
        <span className="order-subtitle-info">
          Order date: &nbsp; <b>{format(order.parsed_created_at, 'MMM, d, yyyy')}</b>
        </span>

        <span className="order-subtitle-info">
          {/* Estimated delivery would be 10 days after order is made */}
          <FaShippingFast fontSize={20} color='#00b33b' /> &nbsp;
          Estimated delivery: &nbsp;
          <b>
            {
              format(
                add(order.parsed_created_at, { days: 10 }),
                'MMM, d, yyyy'
              )
            }
          </b>
        </span>
      </div>

      {/* Products */}
      <div className="order-products-container">
        {
          order.products.map((product) => (
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
        <h1>Delivery Information</h1>

        <div className="info-piece">
          <h4>Contact Name</h4>
          <p>
            {order.contact_name}
          </p>

        </div>

        <div className="info-piece">
          <h4>Address</h4>

          {/*
              UK address example format:

                Mrs Smith 71 Cherry Court SOUTHAMPTON SO53 5PD UK
            */}
          <p>
            {order.address} &nbsp;
            {order.address2} <br />
            {order.city} <br />
            {order.postalcode}<br />
            {order.country}
          </p>

        </div>

        <div className="info-piece">
          <h4>Shipping Status</h4>
          <p>
            {order.shipping_status}
          </p>
        </div>

        <div className="info-piece">
          <h4>Tracking Number</h4>
          <p>
            {order.tracking_number}
          </p>
        </div>

        <div className="info-piece">
          <h4>Carrier</h4>
          <p>
            {order.carrier}
          </p>
        </div>
      </div>

      {/* Order Summary  */}
      <div className="deliver-info-container ">
        <h1> Order Summary </h1>

        <div className="subtotal">
          <p>Subtotal</p>
          <p>
            ${order.subtotal} &nbsp;
            <span className="discount">
              Saved ${order.discount_amount} !
            </span>
          </p>
        </div>

        <div className="cost-info-box info-piece">
          <span className="price-info">
            <span className="title-with-info">
              <p> Shipping Fee </p>
              <BsFillInfoCircleFill />
            </span>
            <p> + ${order.shipping_fee} </p>
          </span>

          <span className="price-info">
            <span className="title-with-info">
              <p> Tax </p>
              <span>
                <BsFillInfoCircleFill />
              </span>
            </span>

            <p> + ${order.tax_amount} </p>
          </span>
        </div>

        <div className="total">
          <p> Total </p>
          <p> ${order.total_amount} </p>
        </div>
      </div>
    </div >
  );
}

export default TrackingOrderIndex;
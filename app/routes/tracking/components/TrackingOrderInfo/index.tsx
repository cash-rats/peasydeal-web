import type { LinksFunction } from '@remix-run/node';
import { FaShippingFast } from 'react-icons/fa';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import add from 'date-fns/add';
import Tooltip from '@mui/material/Tooltip';

import styles from './styles/Tracking.css';
import type { TrackOrder } from '../../types';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

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
*/

interface TrackingOrderIndexProps {
  orderInfo: TrackOrder;
}

function TrackingOrderIndex({ orderInfo }: TrackingOrderIndexProps) {
  orderInfo = parseTrackOrderCreatedAt(orderInfo);

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
                  <p>£{product.sale_price}</p>
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
            {orderInfo.contact_name}
          </p>

        </div>

        <div className="info-piece">
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

        <div className="info-piece">
          <h4>Tracking Number</h4>
          <p>
            {orderInfo.tracking_number}
          </p>
        </div>

        <div className="info-piece">
          <h4>Carrier</h4>
          <p>
            {orderInfo.carrier}
          </p>
        </div>
      </div>

      {/* Order Summary  */}
      <div className="deliver-info-container ">
        <h1> Order Summary </h1>

        <div className="subtotal">
          <p>Subtotal</p>
          <p>
            £{orderInfo.subtotal} &nbsp;
            <span className="discount">
              Saved ${orderInfo.discount_amount} !
            </span>
          </p>
        </div>

        <div className="cost-info-box info-piece">
          <span className="price-info">
            <span className="title-with-info">
              <p> Shipping Fee </p>
            </span>
            <p> + £{orderInfo.shipping_fee} </p>
          </span>

          <span className="price-info">
            <span className="title-with-info">
              <p> Tax </p>
              <span>
                <Tooltip title="20% VAT" arrow>
                  <span>
                    <BsFillInfoCircleFill />
                  </span>
                </Tooltip>
              </span>
            </span>

            <p> + £{orderInfo.tax_amount} </p>
          </span>
        </div>

        <div className="total">
          <p> Total </p>
          <p> £{orderInfo.total_amount} </p>
        </div>
      </div>
    </div >
  );
}

export default TrackingOrderIndex;
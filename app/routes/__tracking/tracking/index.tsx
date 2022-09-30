import type { LinksFunction } from '@remix-run/node';
import { FaShippingFast } from 'react-icons/fa';
import { BsFillInfoCircleFill } from 'react-icons/bs';

import styles from './styles/Tracking.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};
/*
  Reference:
    - https://bbbootstrap.com/snippets/ecommerce-product-order-details-tracking-63470618

  TODOs:
    - [] Deliver & Tax should have tooltips when hover over the icon.

*/
function TrackingOrderIndex() {
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
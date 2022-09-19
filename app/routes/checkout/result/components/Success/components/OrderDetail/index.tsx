import Divider from '@mui/material/Divider';
import type { LinksFunction } from '@remix-run/node';

import styles from './styles/OrderDetail.css';;

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

function OrderDetail() {
  return (
    <div className="order-detail-container">
      <h1>
        Order details
      </h1>

      <div className="order-detail-content">
        <div className="order-detail-row">
          <div className="order-title">
            Order number:
          </div>

          <div className="data">
            86
          </div>
        </div>

        <div className="order-detail-row">
          <div className="order-title">
            Date
          </div>
          <div className="data">
            May 6, 2017
          </div>
        </div>

        <div className="order-detail-row">
          <div className="order-title">
            Payment method
          </div>
          <div className="data">
            Credit Card
          </div>
        </div>
        <Divider />

        {/* Amount */}
        <div className="amount-content">
          <div className="amount-left" />
          <div className="amount-right" >

            <div className="amount-row">
              <label>
                Subtotal
              </label>

              <div className="data">
                $69
              </div>
            </div>

            <div className="amount-row">
              <label>
                Taxes(20%)
              </label>

              <div className="data">
                $69
              </div>
            </div>

            <div className="amount-row">
              <label>
                Total
              </label>

              <div className="data">
                $100
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
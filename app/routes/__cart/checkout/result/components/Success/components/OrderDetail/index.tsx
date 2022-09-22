import Divider from '@mui/material/Divider';
import type { LinksFunction } from '@remix-run/node';
import format from 'date-fns/format';

import styles from './styles/OrderDetail.css';;

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface OrderDetailProps {
  orderUuid: string;
  date: Date;
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  total: number;
}

function OrderDetail({
  subtotal,
  orderUuid,
  date,
  shippingFee,
  taxAmount,
  total,
}: OrderDetailProps) {
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
            {orderUuid}
          </div>
        </div>

        <div className="order-detail-row">
          <div className="order-title">
            Date
          </div>
          <div className="data">
            {format(date, 'MMM dd, yyyy')}
          </div>
        </div>

        <div className="order-detail-row last-row">
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
                ${subtotal}
              </div>
            </div>

            <div className="amount-row">
              <label>
                Taxes(20%)
              </label>

              <div className="data">
                ${taxAmount}
              </div>
            </div>

            <div className="amount-row">
              <label>
                Shipping fee
              </label>

              <div className="data">
                ${shippingFee}
              </div>
            </div>

            <div className="amount-row">
              <label>
                Total
              </label>

              <div className="data">
                ${total}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
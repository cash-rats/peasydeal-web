import { useEffect } from 'react';
import { useFetcher } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import Divider from '@mui/material/Divider';

import OrderAnnotation, { links as OrderAnnotationLinks } from './components/OrderAnnotation';
import OrderDetail, { links as OrderDetailLinks } from './components/OrderDetail';
import { fetchOrder } from './api';
import styles from './styles/Success.css';

export const links: LinksFunction = () => {
  return [
    ...OrderAnnotationLinks(),
    ...OrderDetailLinks(),
    {
      rel: 'stylesheet',
      href: styles,
    }
  ];
}

// Load order information by stripe `client_secret` and it's relative items.
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const orderID = url.searchParams.get('order_id');

  if (!orderID) {
    throw Error('no order id presented in query params');
  }

  const resp = await fetchOrder(orderID)
  const respJSON = await resp.json();
  return json(respJSON);
}

function Success() {
  const orderFetcher = useFetcher();

  useEffect(() => {
    if (window) {
      const orderID = new URLSearchParams(window.location.search).get('order_id');

      // Retrieve order information via loader.
      orderFetcher.submit(
        {},
        {
          method: 'get',
          action: `/checkout/result/components/Success?index&order_id=${orderID}`
        });
    }
  }, []);

  return (
    <div className="checkout-result-container">
      <div className="checkout-result-content">
        {
          orderFetcher.type === 'done' && (
            <OrderAnnotation email={orderFetcher.data.email} />
          )
        }

        {/* Order Detail */}
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

        {/* Product summary */}
        <div className="product-summary-container">
          <h1>
            Products Summary
          </h1>
          <div className="product-content">
            <div className="product-row">
              <div className="left">
                <label>
                  1 X some product
                </label>
                <p>
                  some product intro
                </p>
              </div>

              <div className="right">
                $60
              </div>
            </div>
            <Divider />
            <div className="product-row">
              <div className="left">
                <label>
                  1 X some product
                </label>
                <p>
                  some product intro
                </p>
              </div>

              <div className="right">
                $60
              </div>
            </div>

          </div>
        </div>

        {/* Order summary*/}
        <div className="customer-detail-container">
          <h1>
            Order Information
          </h1>
          <div className="customer-detail">
            <div className="contact">
              <h2>
                contact
              </h2>

              <div className="content">
                <span> Email: huangchiheng@gmail.com </span>
                <span> Phone: 12345678 </span>
              </div>
            </div>

            <div className="billing-address">
              <h2>
                billing address
              </h2>

              <div className="content">
                <span> Andrei Dorin </span>
                <span> some address </span>
                <span> some address 2 </span>
                <span> some zip code </span>
                <span> some country </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

  )

}

export default Success;
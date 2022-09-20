import { useEffect } from 'react';
import { useFetcher } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import Divider from '@mui/material/Divider';
import parseISO from 'date-fns/parseISO';

import OrderAnnotation, { links as OrderAnnotationLinks } from './components/OrderAnnotation';
import OrderDetail, { links as OrderDetailLinks } from './components/OrderDetail';
import ProductSummary, { links as ProductSummaryLinks } from './components/ProductSummary';
import { fetchOrder } from './api';
import styles from './styles/Success.css';

export const links: LinksFunction = () => {
  return [
    ...OrderAnnotationLinks(),
    ...OrderDetailLinks(),
    ...ProductSummaryLinks(),
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
        {
          orderFetcher.type === 'done' && (
            <OrderDetail
              orderUuid={orderFetcher.data.order_uuid}
              date={parseISO(orderFetcher.data.created_at)}
              subtotal={orderFetcher.data.subtotal}
              taxAmount={orderFetcher.data.tax}
              shippingFee={orderFetcher.data.shipping_fee}
              total={orderFetcher.data.total}
            />
          )
        }


        {/* Product summary */}
        {
          orderFetcher.type === 'done' && (
            <ProductSummary products={orderFetcher.data.order_items} />
          )
        }

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
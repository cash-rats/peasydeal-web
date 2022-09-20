import { useEffect } from 'react';
import { useFetcher } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import parseISO from 'date-fns/parseISO';

import OrderAnnotation, { links as OrderAnnotationLinks } from './components/OrderAnnotation';
import OrderDetail, { links as OrderDetailLinks } from './components/OrderDetail';
import ProductSummary, { links as ProductSummaryLinks } from './components/ProductSummary';
import OrderInformation, { links as OrderInformationLinks } from './components/OrderInformation';

import { fetchOrder } from './api';
import styles from './styles/Success.css';

export const links: LinksFunction = () => {
  return [
    ...OrderAnnotationLinks(),
    ...OrderDetailLinks(),
    ...ProductSummaryLinks(),
    ...OrderInformationLinks(),
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
        {
          orderFetcher.type === 'done' && (
            <OrderInformation
              email={orderFetcher.data.email}
              firstname={orderFetcher.data.first_name}
              lastname={orderFetcher.data.last_name}
              address={orderFetcher.data.address}
              address2={orderFetcher.data.address}
              city={orderFetcher.data.city}
              postal={orderFetcher.data.postal}
              country={orderFetcher.data.country}
            />
          )
        }
      </div>
    </div>

  )

}

export default Success;
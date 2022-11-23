import { useEffect, useState } from 'react';
import { useFetcher } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import parseISO from 'date-fns/parseISO';

import OrderAnnotation, { links as OrderAnnotationLinks } from './components/OrderAnnotation';
import OrderDetail, { links as OrderDetailLinks } from './components/OrderDetail';
import ProductSummary, { links as ProductSummaryLinks } from './components/ProductSummary';
import OrderInformation, { links as OrderInformationLinks } from './components/OrderInformation';
import type { SuccessOrderDetail } from './types';

import { fetchOrder } from './api';

export const links: LinksFunction = () => {
  return [
    ...OrderAnnotationLinks(),
    ...OrderDetailLinks(),
    ...ProductSummaryLinks(),
    ...OrderInformationLinks(),
  ];
}

/*
  Load order information by stripe `client_secret` and it's relative items.

  TODOs:
   - [ ] Remove items from shopping cart once payment success.
*/
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const orderUUID = url.searchParams.get('order_uuid');

  if (!orderUUID) {
    throw Error('no order id presented in query params');
  }
  const successOrderDetail = await fetchOrder(orderUUID)
  return json<SuccessOrderDetail>(successOrderDetail);
}

function Success() {
  const orderFetcher = useFetcher();
  const [orderDetail, setOrderDetail] = useState<SuccessOrderDetail | null>(null);

  useEffect(() => {
    if (window) {
      const orderUUID = new URLSearchParams(window.location.search).get('order_uuid');

      // Retrieve order information via loader.
      orderFetcher.submit(
        {},
        {
          method: 'get',
          action: `/checkout/result/components/Success?index&order_uuid=${orderUUID}`
        });
    }
  }, []);

  useEffect(() => {
    if (orderFetcher.type === 'done') {
      setOrderDetail(orderFetcher.data as SuccessOrderDetail);
    }
  }, [orderFetcher]);

  return (
    <div className="checkout-result-container">
      <div className="checkout-result-content">
        {
          orderDetail && orderFetcher.type === 'done' && (
            <>
              <OrderAnnotation
                email={orderDetail.email}
                orderUUID={orderDetail.order_uuid}
              />

              <OrderDetail
                orderUuid={orderDetail.order_uuid}
                date={parseISO(orderDetail.created_at)}
                subtotal={orderDetail.subtotal}
                taxAmount={orderDetail.tax}
                shippingFee={orderDetail.shipping_fee}
                total={orderDetail.total}
              />

              <ProductSummary products={orderDetail.order_items} />

              <OrderInformation
                email={orderDetail.email}
                phone={orderDetail.phone}
                firstname={orderDetail.first_name}
                lastname={orderDetail.last_name}
                address={orderDetail.address}
                address2={orderDetail.address}
                city={orderDetail.city}
                postal={orderDetail.postal}
                country={orderDetail.country}
              />
            </>
          )
        }
      </div>
    </div>

  )

}

export default Success;
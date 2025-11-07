import { useEffect, useState } from 'react';
import { useFetcher } from 'react-router';
import { json } from '@remix-run/node';
import type { ActionFunction } from '@remix-run/node';
import parseISO from 'date-fns/parseISO';

import { clearCart } from '~/sessions/shoppingcart.session';
import { commitSession } from '~/sessions/redis_session';
import { sessionResetTransactionObject } from '~/sessions/transaction.session';

import OrderAnnotation from './components/OrderAnnotation';
import OrderDetail from './components/OrderDetail';
import ProductSummary from './components/ProductSummary';
import OrderInformation from './components/OrderInformation';
import type { SuccessOrderDetail } from './types';
import { fetchOrder } from './api.server';
import LoadingSkeleton from '../LoadingSkeleton';

/*
  Load order information by stripe `client_secret` and it's relative items.

  TODOs:
   - [ ] Remove items from shopping cart once payment success.
*/
export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  const orderUUID = url.searchParams.get('order_uuid');

  if (!orderUUID) {
    throw Error('no order id presented in query params');
  }

  return json<SuccessOrderDetail>(
    await fetchOrder(orderUUID),
    {
      headers: {
        // Clear TransactionObject & shopping cart once payment success.
        'Set-Cookie': await commitSession(
          await sessionResetTransactionObject(
            await clearCart(request),
          )
        ),
      }
    }
  );
}

function Success({ orderId, paymentMethod }: { orderId: string, paymentMethod: string }) {
  const orderFetcher = useFetcher();
  const cartItemCountFetcher = useFetcher();
  const [orderDetail, setOrderDetail] = useState<SuccessOrderDetail | null>(null);

  useEffect(() => {
    if (!orderId) return;
    // Retrieve order information via loader.
    orderFetcher.submit(
      {},
      {
        method: 'post',
        action: `/payment/components/Success?index&order_uuid=${orderId}`
      });

  }, [orderId]);

  useEffect(() => {
    if (orderFetcher.type === 'done') {
      setOrderDetail(orderFetcher.data as SuccessOrderDetail);

      // Once we are done fetching order info and cleared cart,
      // Notify Header component to reload cart item count.
      cartItemCountFetcher.submit(
        null,
        {
          method: 'post',
          action: '/components/Header?index',
          replace: true,
        },
      )

      // Track conversion event
      if (typeof document === 'undefined') return;
      window.rudderanalytics?.track(`purchase`, {
        payment_method: paymentMethod,
        transaction_id: orderId,
        value: orderFetcher.data?.total,
        currency: "GBP",
      });
    }
  }, [orderFetcher]);

  return (
    <div className="w-screen bg-[#f6f6f6] px-[10px] pb-14">
      <div className="max-w-[650px] my-0 mx-auto flex flex-col justify-center items-center">
        {
          orderDetail && orderFetcher.type === 'done' ? (
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
                address2={orderDetail.address2}
                city={orderDetail.city}
                postal={orderDetail.postal}
                country={orderDetail.country}
              />
            </>
          )
            : (<LoadingSkeleton />)
        }
      </div>
    </div>

  )

}

export default Success;
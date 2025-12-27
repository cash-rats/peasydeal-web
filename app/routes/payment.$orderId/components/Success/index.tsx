import { useEffect, useState } from 'react';
import { useFetcher } from 'react-router';
import parseISO from 'date-fns/parseISO/index.js';

import OrderAnnotation from './components/OrderAnnotation';
import OrderDetail from './components/OrderDetail';
import ProductSummary from './components/ProductSummary';
import OrderInformation from './components/OrderInformation';
import SupportCard from './components/SupportCard';
import type { SuccessOrderDetail } from '~/routes/payment/types';
import LoadingSkeleton from '../LoadingSkeleton';
import { trackEvent } from '~/lib/gtm';

/*
  Load order information by stripe `client_secret` and it's relative items.
*/
function Success({ orderId, paymentMethod }: { orderId: string, paymentMethod: string }) {
  const orderFetcher = useFetcher();
  const [orderDetail, setOrderDetail] = useState<SuccessOrderDetail | null>(null);

  useEffect(() => {
    if (!orderId) return;
    orderFetcher.submit(
      {},
      {
        method: 'post',
        action: `/payment?index&order_uuid=${orderId}`
      });

  }, [orderId]);

  useEffect(() => {
    if (orderFetcher.state === 'idle' && orderFetcher.data) {
      setOrderDetail(orderFetcher.data as SuccessOrderDetail);

      // Track conversion event
      if (typeof document === 'undefined') return;
      trackEvent('pd_purchase', {
        payment_method: paymentMethod,
        transaction_id: orderId,
        value: orderFetcher.data?.total,
        currency: "GBP",
      });
    }
  }, [orderFetcher.data, orderFetcher.state, orderId, paymentMethod]);

  console.log('~~ 1 orderDetail', orderDetail);

  return (
    <div className="w-full bg-gray-50 px-4 pb-14">
      <div className="mx-auto flex max-w-5xl flex-col justify-center py-8">
        {
          orderDetail && orderFetcher.state === 'idle' ? (
            <>
              <OrderAnnotation
                email={orderDetail.email}
                orderUUID={orderDetail.order_uuid}
              />

              <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                  <OrderDetail
                    orderUuid={orderDetail.order_uuid}
                    date={parseISO(orderDetail.created_at)}
                    subtotal={orderDetail.subtotal}
                    taxAmount={orderDetail.tax}
                    shippingFee={orderDetail.shipping_fee}
                    total={orderDetail.total}
                    paymentMethod={paymentMethod}
                  >
                    <ProductSummary products={orderDetail.order_items} />
                  </OrderDetail>
                </div>

                <div className="space-y-6 lg:col-span-1">
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

                  <SupportCard />
                </div>
              </div>
            </>
          )
            : (<LoadingSkeleton />)
        }
      </div>
    </div>

  )

}

export default Success;

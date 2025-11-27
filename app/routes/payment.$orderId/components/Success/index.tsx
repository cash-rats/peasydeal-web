import { useEffect, useState } from 'react';
import { useFetcher } from 'react-router';
import parseISO from 'date-fns/parseISO';

import OrderAnnotation from './components/OrderAnnotation';
import OrderDetail from './components/OrderDetail';
import ProductSummary from './components/ProductSummary';
import OrderInformation from './components/OrderInformation';
import type { SuccessOrderDetail } from '~/routes/payment/types';
import LoadingSkeleton from '../LoadingSkeleton';

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
      window.rudderanalytics?.track(`purchase`, {
        payment_method: paymentMethod,
        transaction_id: orderId,
        value: orderFetcher.data?.total,
        currency: "GBP",
      });
    }
  }, [orderFetcher.data, orderFetcher.state, orderId, paymentMethod]);

  return (
    <div className="w-screen bg-[#f6f6f6] px-[10px] pb-14">
      <div className="max-w-[650px] my-0 mx-auto flex flex-col justify-center items-center">
        {
          orderDetail && orderFetcher.state === 'idle' ? (
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

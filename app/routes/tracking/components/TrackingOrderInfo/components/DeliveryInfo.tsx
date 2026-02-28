import { useMemo } from 'react';

import InfoPiece from './InfoPiece';
import TrackingTable from './TrackingTable';
import type { TrackOrder } from '../../../types';
import { PaymentStatus } from '../../../types';

type DeliveryInfoProps = {
  orderInfo: TrackOrder;
};

function DeliveryInfo({ orderInfo }: DeliveryInfoProps) {
  const contactName = orderInfo.display_name || orderInfo.contact_name;
  const address = orderInfo.display_address || [
    orderInfo.address,
    orderInfo.address2,
    orderInfo.city,
    orderInfo.country,
  ].filter(Boolean).join(', ');
  const paymentStatusWording = useMemo(() => {
    return {
      [PaymentStatus.Paid]: 'Paid',
      [PaymentStatus.Unpaid]: 'Unpaid',
      [PaymentStatus.ReviewRefund]: 'Processing refund',
      [PaymentStatus.Refunded]: 'Refunded',
    }
  }, []);
  const trackingRows = useMemo(() => {
    const uniqTrackings = new Map<string, {
      trackingNumber: string;
      carrier?: string;
      trackingLink?: string;
    }>();

    for (const product of orderInfo.products) {
      if (!product.tracking_number) continue;
      const key = `${product.carrier || ''}-${product.tracking_number}`;

      if (!uniqTrackings.has(key)) {
        uniqTrackings.set(key, {
          trackingNumber: product.tracking_number,
          carrier: product.carrier,
          trackingLink: product.tracking_link,
        });
      }
    }

    return Array.from(uniqTrackings.values());
  }, [orderInfo.products]);

  return (
    <div className="rounded-rd-md border border-rd-border-light p-6">
      <h2 className="mb-5 font-body text-sm font-semibold uppercase tracking-[0.5px] text-black">
        Delivery Information
      </h2>

      <div className="grid grid-cols-1 gap-5 redesign-sm:grid-cols-2">
        <InfoPiece
          title='Contact Name'
          info={contactName || '—'}
        />

        <InfoPiece
          title='Address'
          info={address || '—'}
        />

        {
          orderInfo.display_postalcode
            ? (
              <InfoPiece
                title='Postal Code'
                info={orderInfo.display_postalcode}
              />
            )
            : null
        }

        <InfoPiece
          title='Payment Status'
          info={paymentStatusWording[orderInfo.payment_status]}
        />

        {
          orderInfo.shipping_status
            ? (
              <InfoPiece
                title='Shipping Status'
                info={orderInfo.shipping_status.split('_').join(' ')}
              />
            )
            : null
        }
      </div>

      {trackingRows.length > 0 ? <TrackingTable trackings={trackingRows} /> : null}
    </div>
  );
}

export default DeliveryInfo;

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
      [PaymentStatus.Paid]: 'Paid.',
      [PaymentStatus.Unpaid]: 'Unpaid.',
      [PaymentStatus.ReviewRefund]: "We are processing refund on cancelled order.",
      [PaymentStatus.Refunded]: 'Refunded',
    }
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900">
        Delivery Information
      </h2>

      <div className="mt-5 space-y-4 text-sm text-gray-700">
        <InfoPiece
          title='Contact Name'
          info={contactName || '—'}
        />

        <InfoPiece
          title='Address'
          info={(
            <p className="text-gray-900">
              {address || '—'}
            </p>
          )}
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

        {
          orderInfo.tracking_number
            ? (
              <TrackingTable trackings={[
                {
                  carrier: orderInfo.carrier,
                  trackingNumber: orderInfo.tracking_number,
                  trackingLink: orderInfo.tracking_link,
                }
              ]} />
            )
            : null
        }
      </div>
    </div>
  );
}

export default DeliveryInfo;

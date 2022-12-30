import InfoPiece from './InfoPiece';
import TrackingTable from './TrackingTable';
import type { TrackOrder } from '../../../types';

type DeliveryInfoProps = {
  orderInfo: TrackOrder;
};

// - [x] No need to display shipping status when payment status is `unpaid`
// - [x] Only display shipping status table when shipping status is `shipping`
function DeliveryInfo({ orderInfo }: DeliveryInfoProps) {
  return (
    <div className="p-4 border-[1px] border-border-color border-b-0 bg-white">
      <h1 className="text-xl font-normal mb-[0.7rem]">
        Delivery Information
      </h1>

      <InfoPiece
        title='Contact Name'
        info={orderInfo.contact_name}
      />

      <InfoPiece
        title='Address'
        info={(
          <p>
            {orderInfo.address} &nbsp;
            {orderInfo.address2} <br />
            {orderInfo.city} <br />
            {orderInfo.postalcode}<br />
            {orderInfo.country}
          </p>
        )}
      />

      <InfoPiece
        title='Payment Status'
        info={orderInfo.payment_status}
      />

      {orderInfo.payment_status === 'paid' && (
        <>
          <InfoPiece
            title='Shipping Status'
            info={orderInfo.shipping_status}
          />

          {
            orderInfo.shipping_status === 'shipping' && (
              <TrackingTable trackings={[
                {
                  carrier: orderInfo.carrier,
                  trackingNumber: orderInfo.tracking_number,
                  trackingLink: orderInfo.tracking_link,
                }
              ]} />
            )
          }
        </>
      )}
    </div>
  );
}

export default DeliveryInfo;
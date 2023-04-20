import type { ReactNode } from 'react';
import Divider from '@mui/material/Divider';
import format from 'date-fns/format';
import { round10 } from '~/utils/preciseRound';

interface AmountRowProps {
  title: ReactNode;
  num: number;
};

function AmountRow({ title, num }: AmountRowProps) {
  return (
    <div className="flex flex-row w-full">
      <label className="text-left w-[69%] flex justify-start capitalize font-poppins">
        {title}
      </label>

      <div className="w-[31%] flex justify-end font-medium">
        ${num}
      </div>
    </div>
  )
}

interface OrderDetailProps {
  orderUuid: string;
  date: Date;
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  total: number;
}

function OrderDetail({
  subtotal,
  orderUuid,
  date,
  shippingFee,
  taxAmount,
  total,
}: OrderDetailProps) {
  return (
    <div className="border-[1px] border-[#E6E6E6] bg-white mt-6 w-full p-3 flex flex-col">
      <h1 className="font-bold font-poppins text-[1.2rem]">
        Order details
      </h1>

      <div className="mt-4 flex flex-col gap-[5px]">
        <div className="flex flex-row justify-between">
          <div>
            Order number:
          </div>

          <div className="font-medium">
            {orderUuid}
          </div>
        </div>

        <div className="flex flex-row justify-between">
          <div>
            Date
          </div>
          <div className="font-medium">
            {format(date, 'MMM dd, yyyy')}
          </div>
        </div>

        <div className="flex flex-row justify-between mb-3">
          <div>
            Payment method
          </div>
          <div className="font-medium">
            Credit Card
          </div>
        </div>

        <Divider />

        {/* Amount */}
        <div className="flex flex-row mt-4">
          <div className="w-[45%] 499:w-[60%]" />
          <div className="flex flex-col w-1/2 gap-1 499:w-[40%]" >
            <AmountRow
              title='Subtotal (VAT Incl.)'
              num={round10(subtotal + taxAmount, -2)}
            />

            <AmountRow
              title='Shipping fee'
              num={shippingFee}
            />

            <AmountRow
              title='Total'
              num={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
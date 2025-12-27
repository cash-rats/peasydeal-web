import type { ReactNode } from 'react';
import format from 'date-fns/format/index.js';
import { round10 } from '~/utils/preciseRound';

import { CreditCard } from 'lucide-react';

import { Card, CardContent } from '~/components/ui/card';

interface AmountRowProps {
  title: string;
  value: string;
  valueClassName?: string;
};

function AmountRow({ title, value, valueClassName }: AmountRowProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="text-muted-foreground">
        {title}
      </div>
      <div className={valueClassName ?? 'font-medium text-foreground'}>
        {value}
      </div>
    </div>
  );
}

interface OrderDetailProps {
  orderUuid: string;
  date: Date;
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  total: number;
  paymentMethod?: string;
  statusLabel?: string;
  children?: ReactNode;
}

function OrderDetail({
  subtotal,
  orderUuid,
  date,
  shippingFee,
  taxAmount,
  total,
  paymentMethod,
  statusLabel = 'Confirmed',
  children,
}: OrderDetailProps) {
  const vatIncludedSubtotal = round10(subtotal + taxAmount, -2).toFixed(2);
  const shippingFeeAmount = round10(shippingFee, -2).toFixed(2);
  const totalAmount = round10(total, -2).toFixed(2);
  const resolvedPaymentMethod = paymentMethod?.trim() ? paymentMethod : 'Credit Card';

  return (
    <Card className="overflow-hidden shadow-sm">
      <div className="flex items-center justify-between border-b bg-muted/40 px-6 py-4">
        <h2 className="text-lg font-semibold text-foreground">
          Order Details
        </h2>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
          {statusLabel}
        </span>
      </div>

      <CardContent className="space-y-8 px-6 pb-0 pt-6">
        <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-3">
          <div>
            <p className="text-muted-foreground">Order Number</p>
            <p className="mt-1 font-mono font-medium text-foreground">
              {orderUuid}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Date</p>
            <p className="mt-1 font-medium text-foreground">
              {format(date, 'MMM dd, yyyy')}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Payment Method</p>
            <div className="mt-1 flex items-center gap-2 font-medium text-foreground">
              <CreditCard className="h-4 w-4 text-muted-foreground" aria-hidden />
              <span>{resolvedPaymentMethod}</span>
            </div>
          </div>
        </div>

        {children ? (
          <div className="border-t pt-6">
            {children}
          </div>
        ) : null}

        <div className="-mx-6 overflow-hidden border-t bg-muted/30">
          <div className="space-y-2 px-6 py-4 text-xs">
            <AmountRow
              title="Subtotal (VAT Incl.)"
              value={`$${vatIncludedSubtotal}`}
              valueClassName="font-medium text-foreground"
            />

            <AmountRow
              title="Shipping Fee"
              value={shippingFee === 0 ? 'Free' : `$${shippingFeeAmount}`}
              valueClassName={
                shippingFee === 0 ? 'font-medium text-emerald-600' : 'font-medium text-foreground'
              }
            />
          </div>

          <div className="flex items-center justify-between border-t px-6 py-4">
            <div className="text-sm font-semibold text-foreground">Total</div>
            <div className="text-base font-semibold text-foreground">
              ${totalAmount}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetail;

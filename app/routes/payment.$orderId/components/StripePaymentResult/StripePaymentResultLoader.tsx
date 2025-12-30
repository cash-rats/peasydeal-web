import { useEffect, useState } from 'react';
import type { PaymentIntent, Stripe } from '@stripe/stripe-js';

import LoadingSkeleton from '~/routes/payment.$orderId/components/LoadingSkeleton';
import Success from '~/routes/payment.$orderId/components/Success';
import Failed from '~/routes/payment.$orderId/components/Failed';

/*
  TODOs
    - [ ] Show failed screen if payment status isn't success.
    - [ ] Style loading page.
*/
interface PaymentResultLoaderProps {
  clientSecret: string;
  orderId: string;
  stripePromise: Promise<Stripe | null>;
};

function PaymentResultLoader({ clientSecret, orderId, stripePromise }: PaymentResultLoaderProps) {
  const [stripePaymentStatus, setStripePaymentStatus] = useState<PaymentIntent.Status | null | undefined>(null);

  useEffect(() => {
    let isCancelled = false;

    stripePromise
      .then((stripe) => {
        if (!stripe) throw new Error('Stripe not initialized');
        return stripe.retrievePaymentIntent(clientSecret);
      })
      .then((result) => {
        if (isCancelled) return;
        setStripePaymentStatus(result?.paymentIntent?.status);
      })
      .catch(() => {
        if (isCancelled) return;
        setStripePaymentStatus('requires_payment_method');
      });

    return () => {
      isCancelled = true;
    };
  }, [clientSecret, stripePromise]);

  function renderResult(paymentStatus: PaymentIntent.Status | null | undefined) {
    if (paymentStatus === 'succeeded') {
      return (<Success orderId={orderId} paymentMethod="stripe" />);
    }

    if (paymentStatus === 'requires_payment_method') {
      // Redirect your user back to your payment page to attempt collecting
      // payment again
      return (
        <Failed
          reason="Payment failed. Please try another payment method."
          solution="You will be redirected to checkout to input proper payment method"
          paymentStatus={paymentStatus}
        />
      );
    }

    if (paymentStatus === 'processing') {
      return (
        <Failed
          reason="Payment processing. We'll update you when payment is received."
          solution="You'll receive an email about your order detail once payment is processed"
          paymentStatus={paymentStatus}
        />
      );
    }

    if (paymentStatus) {
      return (
        <Failed
          reason="Payment not completed."
          solution="You will be redirected to checkout to try again."
          paymentStatus={paymentStatus}
        />
      );
    }

    return (
      <div className="w-full bg-gray-50 px-4 pb-14">
        <div className="mx-auto flex max-w-5xl flex-col justify-center py-8">
          <LoadingSkeleton />
        </div>
      </div>
    )
  }

  return (
    <> {renderResult(stripePaymentStatus)} </>
  );
}

export default PaymentResultLoader

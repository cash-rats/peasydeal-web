import { useEffect, useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import type { PaymentIntent } from '@stripe/stripe-js';

import LoadingSkeleton from '../../../LoadingSkeleton';
import Success from '../../../Success';
import Failed from '../../../Failed';

/*
  TODOs
    - [ ] Show failed screen if payment status isn't success.
    - [ ] Style loading page.
*/
interface PaymentResultLoaderProps {
  clientSecret: string;
  orderId: string;
};

function PaymentResultLoader({ clientSecret, orderId }: PaymentResultLoaderProps) {
  const stripe = useStripe();
  const [stripePaymentStatus, setStripePaymentStatus] = useState<PaymentIntent.Status | null | undefined>(null);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent = {} }) => {
        setStripePaymentStatus(paymentIntent.status);
      })
  }, [clientSecret, stripe]);

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

    return (<LoadingSkeleton />)
  }

  return (
    <div>
      {renderResult(stripePaymentStatus)}
    </div>
  );
}

export default PaymentResultLoader

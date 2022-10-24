/*
  TODOs
    - [ ] Show failed screen if payment status isn't success.
    - [ ] Style loading page.
*/

import { useEffect, useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import type { PaymentIntent } from '@stripe/stripe-js';
import type { LinksFunction } from '@remix-run/node';
import Skeleton from '@mui/material/Skeleton';

import Success, { links as SuccessLinks } from '../Success';
import Failed, { links as FailedLinks } from '../Failed';

export const links: LinksFunction = () => {
  return [
    ...SuccessLinks(),
    ...FailedLinks(),
  ];
};

function LoadingSkeleton() {
  return (
    <div className='skeleton-container'>

      {/* For variant="text", adjust the height via font-size */}
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />

      {/* For other variants, adjust the size with `width` and `height` */}
      <Skeleton variant="text" width={160} height={40} />
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rounded" height={60} />
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={60} />
    </div>
  );
}

function PaymentResultLoader({ clientSecret }: { clientSecret: string }) {
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
      return (<Success />);
    }

    if (paymentStatus === 'requires_payment_method') {
      return (
        <Failed
          reason="Payment failed. Please try another payment method."
          solution="You will be redirected to checkout to input proper payment method"
        />
      );
    }

    if (paymentStatus === 'processing') {
      return (
        <Failed
          reason="Payment processing. We'll update you when payment is received."
          solution="You'll receive an email about your order detail once payment is processed"
        />
      );
    }

    return (<LoadingSkeleton />)
  }

  return (
    <div className="PaymentResultLoader__wrapper">
      {renderResult(stripePaymentStatus)}
    </div>
  );
}

export default PaymentResultLoader
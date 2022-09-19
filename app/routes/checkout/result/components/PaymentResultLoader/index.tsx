/*
  TODOs
    - [ ] Show failed screen if payment status isn't success.
    - [ ] Style loading page.
*/

import { useEffect, useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import type { PaymentIntent } from '@stripe/stripe-js';
import type { LinksFunction } from '@remix-run/node';

import Success, { links as SuccessLinks } from '../Success';

export const links: LinksFunction = () => {
  return [
    ...SuccessLinks(),
  ];
};

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
    // Payment status is still loading.
    if (!paymentStatus) {
      return 'loading...';
    }

    if (paymentStatus === 'succeeded') {
      return (<Success />);
    }

    return <>show</>
  }

  return (<>{renderResult(stripePaymentStatus)}</>);
}

export default PaymentResultLoader
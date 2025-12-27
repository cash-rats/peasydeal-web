import { useState, useEffect } from 'react';
import type { Stripe, StripeElementsOptions } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { envs } from '~/utils/env'

import PaymentResultLoader from './StripePaymentResultLoader';
import LoadingSkeleton from '~/routes/payment.$orderId/components/LoadingSkeleton';

interface StripePaymentResultProps {
  orderID: string;
  clientSecret: string;
}

export default function StripePaymentResult({ orderID, clientSecret }: StripePaymentResultProps) {

  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    if (window && envs.STRIPE_PUBLIC_KEY) {
      setStripePromise(loadStripe(envs.STRIPE_PUBLIC_KEY));
    }
  }, []);


  const options: StripeElementsOptions = {
    // passing the client secret obtained in step 2
    clientSecret,

    // Fully customizable with appearance API.
    appearance: {},

    // Only allows england for now.
    locale: 'en-GB',
  };

  return (
    <>
      {stripePromise ? (
        <Elements stripe={stripePromise} options={options}>
          <PaymentResultLoader orderId={orderID} clientSecret={clientSecret} />
        </Elements>
      ) : (
        <div className="w-full bg-gray-50 px-4 pb-14">
          <div className="mx-auto flex max-w-5xl flex-col justify-center py-8">
            <LoadingSkeleton />
          </div>
        </div>
      )}
    </>
  )
}

import { useState, useEffect } from 'react';
import type { Stripe, StripeElementsOptions } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { STRIPE_PUBLIC_KEY } from '~/utils/get_env_source'

import PaymentResultLoader from './components/StripePaymentResultLoader';

interface StripePaymentResultProps {
  orderID: string;
  clientSecret: string;
}

export default function StripePaymentResult({ orderID, clientSecret }: StripePaymentResultProps) {

  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    if (window && STRIPE_PUBLIC_KEY) {
      setStripePromise(loadStripe(STRIPE_PUBLIC_KEY));
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
      {
        stripePromise && (
          <Elements
            stripe={stripePromise}
            options={options}
          >
            {
              <PaymentResultLoader
                orderId={orderID}
                clientSecret={clientSecret}
              />
            }
          </Elements>
        )
      }
    </>
  )
}
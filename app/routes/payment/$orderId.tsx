import { useState, useEffect } from 'react';
import type { LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { Stripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import PaymentResultLoader from './components/PaymentResultLoader';

type LoaderDataType = {
  clientSecret: string;
  orderId: string;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { orderId } = params;

  if (!orderId) {
    throw json('404 not found');
  }

  // Get stripe client secret
  const url = new URL(request.url);
  const clientSecret = url.searchParams.get('payment_intent_client_secret');

  if (!clientSecret) {
    throw redirect('/cart');
  }

  return json<LoaderDataType>({ clientSecret, orderId });
}

export default function PaymentResult() {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const {
    clientSecret = '',
    orderId,
  } = useLoaderData<LoaderDataType>();

  useEffect(() => {
    if (window) {
      setStripePromise(loadStripe(window.ENV.ENV.STRIPE_PUBLIC_KEY));
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
                orderId={orderId}
                clientSecret={clientSecret}
              />
            }
          </Elements>
        )
      }
    </>
  );
}
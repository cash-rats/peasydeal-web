/*
  TODOs
    - [ ] Check with stripe to see if a given client secret is paid order not. If paid show success page. If not show failed page.
    - [ ] Retrieve order items from server.
    - [ ] Provide a link for customer to trace their package.
    - [x] Continue shopping button.
    - [ ] List of purchased products
*/
import { useEffect, useState } from 'react';
import styles from './styles/CheckoutResult.css';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import PaymentResultLoader, { links as PaymentResultLoaderLinks } from './components/PaymentResultLoader';

export const links: LinksFunction = () => {
  return [
    ...PaymentResultLoaderLinks(),
    { rel: 'stylesheet', href: styles }
  ];
}

// Retrievea stripe `payment_intent_client_secret` from url search params.
// @docs https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=elements&html-or-react=react
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const clientSecret = url.searchParams.get('payment_intent_client_secret');

  // If `payment_intent_client_secret` or `order_id` does not exists in the query params, it means client requested this page
  // directly without proper redirection. We simply redrect them to `/cart` page so that customers can finish the checkout flow
  // properly.
  if (!clientSecret) {
    throw redirect('/cart');
  }

  return json({ clientSecret });
}

function CheckoutResult() {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const { clientSecret = '' } = useLoaderData();

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
              <PaymentResultLoader clientSecret={clientSecret} />
            }
          </Elements>
        )
      }
    </>
  );
};

export default CheckoutResult
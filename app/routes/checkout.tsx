import { useEffect, useState } from 'react';
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions, Stripe, StripeError, StripeElements } from '@stripe/stripe-js';

import { getSession } from '~/sessions';
import type { SessionKey } from '~/sessions';
import LogoHeader, { links as LogoHeaderLinks } from '~/components/Header/components/LogoHeader';
import Footer, { links as FooterLinks } from '~/components/Footer';
import { calcGrandTotal } from '~/utils/checkout_accountant';
import { createPaymentIntent } from '~/utils/stripe.server';


export const links: LinksFunction = () => {
  return [
    ...FooterLinks(),
    ...LogoHeaderLinks(),
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  // Retrieve products from session. create strip payment intend.
  const session = await getSession(
    request.headers.get('Cookie'),
  );

  // Check if `shopping_cart` session exists.
  const sessionKey: SessionKey = 'shopping_cart';
  if (!session.has(sessionKey)) {
    throw redirect("/cart");
  }

  const cartItems = session.get(sessionKey);

  if (cartItems && Object.keys(cartItems).length === 0) {
    throw redirect("/cart");
  }

  // TODO this number should be coming from BE instead.
  // https://stackoverflow.com/questions/45453090/stripe-throws-invalid-integer-error
  // In stripe, the base unit is 1 cent, not 1 dollar.
  const amount = Number(calcGrandTotal(cartItems).toFixed(2))

  // Construct stripe `PaymentIntend`
  const paymentIntent = await createPaymentIntent({
    amount: Math.round(amount * 100),
    currency: 'GBP'
  });

  return json({ client_secret: paymentIntent.client_secret });
}

type ContextType = { clientSecret: string };

function CheckoutLayout() {
  const {
    /* Stripe payment intend client secret, every secret is different every time we refresh the page */
    client_secret: clientSecret,
  } = useLoaderData();

  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  const options: StripeElementsOptions = {
    // passing the client secret obtained in step 2
    clientSecret,

    // Fully customizable with appearance API.
    appearance: {},

    // Only allows england for now.
    locale: 'en-GB',
  };

  useEffect(() => {
    if (window) {
      setStripePromise(loadStripe(window.ENV.ENV.STRIPE_PUBLIC_KEY));
    }
  }, []);

  return (
    <>
      <LogoHeader />

      <main>
        {
          stripePromise && (
            <Elements
              stripe={stripePromise}
              options={options}
            >
              <Outlet context={{ clientSecret }} />
            </Elements>
          )
        }
      </main>

      <Footer />
    </>
  );
};

export function useContext() {
  return useOutletContext<ContextType>();
}

export default CheckoutLayout
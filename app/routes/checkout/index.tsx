import { Fragment, useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions, Stripe } from '@stripe/stripe-js';
import Divider from '@mui/material/Divider';


import { getSession } from '~/sessions';
import type { SessionKey } from '~/sessions';
import { calcGrandTotal } from '~/utils/checkout_accountant';
import { createPaymentIntent } from '~/utils/stripe.server';

import styles from './styles/Checkout.css';
import CheckoutForm, { links as CheckoutFormLinks } from './components/CheckoutForm';
import ShippingDetailForm, { links as ShippingDetailFormLinks } from './components/ShippingDetailForm';

export const links: LinksFunction = () => {
  return [
    ...ShippingDetailFormLinks(),
    ...CheckoutFormLinks(),
    { rel: 'stylesheet', href: styles },
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
    throw redirect("/empty_cart");
  }

  const cartItems = session.get(sessionKey);

  if (cartItems && Object.keys(cartItems).length === 0) {
    throw redirect("/empty_cart");
  }

  // https://stackoverflow.com/questions/45453090/stripe-throws-invalid-integer-error
  // In stripe, the base unit is 1 cent, not 1 dollar.
  const amount = Number(calcGrandTotal(cartItems).toFixed(2))

  // Construct stripe `PaymentIntend`
  // TODO currency should be GBP
  const paymentIntent = await createPaymentIntent({
    amount: Math.round(amount * 100),
    currency: 'usd'
  });

  return json({
    amount,
    cart_items: cartItems,
    client_secret: paymentIntent.client_secret
  });
};

// TODO retrieve this secret from node.

function CheckoutPage() {
  const {
    amount,
    client_secret: clientSecret,
    cart_items: cartItems,
  } = useLoaderData();
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    if (window) {
      setStripePromise(loadStripe(window.ENV.ENV.STRIPE_PUBLIC_KEY));
    }
  }, []);

  // TODO retrieve client secret from node
  const options: StripeElementsOptions = {
    // passing the client secret obtained in step 2
    clientSecret,

    // Fully customizable with appearance API.
    appearance: {},

    // Only allows england for now.
    locale: 'en-GB',
  };

  return (
    <section className="checkout-page-container">
      <h1 className="title">
        Shipping Information
      </h1>

      <div className="checkout-content">
        <div className="left">

          {/* You Details  */}
          <div className="form-container">


            {/* product summary TODO add edit link */}
            <div className="pricing-panel">
              <h1 className="form-title">
                Cart Summary
              </h1>

              <div className="product-tiles">
                {
                  Object.keys(cartItems).map((prodID: string): ReactElement => {
                    const cartItem = cartItems[prodID];
                    return (
                      <Fragment key={prodID}>
                        <div className="product-tile">
                          <div className="product-desc">
                            <h3>
                              {cartItem.title}
                            </h3>
                            <p>
                              {cartItem.subTitle}
                            </p>
                          </div>
                          <h2 className="product-price">
                            {cartItem.quantity} x ${cartItem.salePrice}
                          </h2>
                        </div>
                        <Divider />
                      </Fragment>
                    )
                  })
                }
              </div>

              {/* Subtotal */}
              <div className="subtotal">
                Total: &nbsp; <span>${amount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="right">
          {/* Shipping Info */}
          <div className="form-container">
            <h1 className="shipping-info-title">
              Shipping Details
            </h1>

            <div className="pricing-panel">
              <div className="shipping-form-container">
                <ShippingDetailForm />
              </div>
            </div>
          </div >

          <div className='form-container'>
            <h3 className="title">
              Payment Information
            </h3>
            {/* You Details  */}
            <div className="pricing-panel">
              <div className="payment-form-container">
                {
                  stripePromise && (
                    <Elements stripe={stripePromise} options={options} >
                      <CheckoutForm />
                    </Elements>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CheckoutPage;

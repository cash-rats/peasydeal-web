/*
  TODOs
    - [ ] order amount should be calculated and send from backend.
    - [ ] `client_secret` should be move to action.
    - [x] Redirect to successful page.
*/

import { Fragment, useEffect, useState, useRef } from 'react';
import type { ReactElement } from 'react';
import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions, Stripe, StripeError } from '@stripe/stripe-js';
import Divider from '@mui/material/Divider';
import type { FormikProps, FormikValues } from 'formik';

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
    throw redirect("/cart");
  }

  const cartItems = session.get(sessionKey);

  if (cartItems && Object.keys(cartItems).length === 0) {
    throw redirect("/cart");
  }

  // https://stackoverflow.com/questions/45453090/stripe-throws-invalid-integer-error
  // In stripe, the base unit is 1 cent, not 1 dollar.
  const amount = Number(calcGrandTotal(cartItems).toFixed(2))

  // Construct stripe `PaymentIntend`
  const paymentIntent = await createPaymentIntent({
    amount: Math.round(amount * 100),
    currency: 'GBP'
  });

  return json({
    amount,
    cart_items: cartItems,

    // TODO client_secret should be move to action.
    client_secret: paymentIntent.client_secret
  });
};

function CheckoutPage() {
  const {
    amount,
    /* Stripe payment intend client secret, every secret is different every time we refresh the page */
    client_secret: clientSecret,
    cart_items: cartItems,
  } = useLoaderData();
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [paymentMessage, setPaymentMessage] = useState<string | undefined>(undefined);

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

  const shippingDetailRef = useRef<FormikProps<FormikValues>>(null);

  const validateShippingForm = async (): Promise<undefined | [boolean, FormikValues]> => {
    if (!shippingDetailRef.current) return;

    shippingDetailRef.current.handleSubmit();
    // Validate shipping detail form before we can perform stripe checkout.
    const errors = await shippingDetailRef.current.validateForm();
    return [
      Object.keys(errors).length > 0,
      shippingDetailRef.current.values,
    ];
  }

  const handlePaymentResult = async (orderID: string, error: StripeError | undefined) => {
    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setPaymentMessage(error.message);
      } else {
        setPaymentMessage("An unexpected error occurred.")
      }

      return;
    }

    setPaymentMessage(null);
    // Return to payment success page with query param payment intend client secret.
    // Check
    console.log('resp', orderID);
    // debugger;
  }

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
                <ShippingDetailForm ref={shippingDetailRef} />
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
                  // When create order action is triggered in `CheckoutForm`, current load will be triggered to realod client secret causing display of the warning.
                  // The following is a temperary solution.
                  // @docs https://stackoverflow.com/questions/70864433/integration-of-stripe-paymentelement-warning-unsupported-prop-change-options-c
                  stripePromise && (
                    <Elements
                      stripe={stripePromise}
                      options={options}
                    >
                      <CheckoutForm
                        validateBeforeCheckout={validateShippingForm}
                        onPaymentResult={handlePaymentResult}
                        clientSecret={clientSecret}
                        orderDetail={cartItems}
                      />
                    </Elements>
                  )
                }
                {
                  paymentMessage && (
                    <div>
                      {paymentMessage}
                    </div>
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

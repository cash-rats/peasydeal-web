import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import Divider from '@mui/material/Divider';


import { getSession, SessionKey } from '~/sessions';
import { createPaymentIntent } from '~/utils/stripe.server';

import styles from './styles/Checkout.css';
import CheckoutForm, { links as CheckoutFormLinks } from './components/CheckoutForm';
import ShippingDetailForm, { links as ShippingDetailFormLinks } from './components/ShippingDetailForm';

export const links: LinksFunction = () => {
  return [
    // ...EmptyShoppingCartLinks(),
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
  // TODO: If `shopping_cart` does'n exist. Display error page showing shopping cart has no items.
  const sessionKey: SessionKey = 'shopping_cart';
  if (!session.has(sessionKey)) {
    throw redirect("/empty_cart");
  }

  const cartItems = session.get(sessionKey);

  if (cartItems && Object.keys(cartItems).length === 0) {
    throw redirect("/empty_cart");
  }

  // TODO Calculate the amount to charge.

  // Construct stripe `PaymentIntend`
  const paymentIntent = await createPaymentIntent({ amount: 100, currency: 'usd' });

  console.log('debug 5');

  return json({
    cart_items: cartItems,
    client_secret: paymentIntent.client_secret
  });
};

// TODO retrieve this secret from node.
const stripePromise = loadStripe('pk_test_51LggxmBWJAcUOOvj6slyMPrurLwUhiFy6j59ckvOfykwIKxnSlizJAa961bAGpzoCcmvcFC9CdSwTXpOgeaJhIdI00KEwbxOqW');

function CheckoutPage() {
  const {
    client_secret: clientSecret,
    cart_items: cartItems,
  } = useLoaderData();
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


            {/* product summary */}
            <div className="pricing-panel">
              <h1 className="form-title">
                Cart Summary
              </h1>

              <div className="product-tiles">
                <div className="product-tile">
                  <div className="product-desc">
                    <h3>
                      1 x Maker The Agency Theme
                    </h3>
                    <p> Amazing UI Kit pack perfect for your next project </p>
                  </div>
                  <h2 className="product-price">
                    $49.89
                  </h2>
                </div>
                <Divider />

                <div className="product-tile">
                  <div className="product-desc">
                    <h3>
                      1 x Maker The Agency Theme
                    </h3>
                    <p> Amazing UI Kit pack perfect for your next project </p>
                  </div>
                  <h2 className="product-price">
                    $49.89
                  </h2>
                </div>
              </div>

              {/* Subtotal */}
              <div className="subtotal">
                Sub Total: &nbsp; <span>$102.44</span>
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
                <Elements stripe={stripePromise} options={options} >
                  <CheckoutForm />
                </Elements>
              </div>
            </div>
          </div>

        </div>


      </div>
    </section>
  );
}

export default CheckoutPage;

import { useRef, useState, useEffect } from 'react';
import type { LinksFunction } from '@remix-run/node';
import { PaymentElement } from '@stripe/react-stripe-js';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import LockIcon from '@mui/icons-material/Lock';
import type { StripePaymentElement } from '@stripe/stripe-js';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import styles from './styles/CheckoutForm.css';
import paypalPng from './images/paypal.png';
import selectedRadioCircleSVG from './images/selected_radio_circle.svg';


export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface StripeCheckoutFormProps {
  loading?: boolean;
}

type PaymentMethods = 'stripe_methods' | 'paypal';

// TODO:
//  - [ ] error message.
//  - [ ] loading icon.
//  - [ ] payment form validation.
//  - [ ] [To submit payment on server](https://stripe.com/docs/payments/accept-a-payment-synchronously?html-or-react=react)
function StripeCheckoutForm({ loading = false }: StripeCheckoutFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethods>("paypal");
  const paymentElement = useRef<StripePaymentElement | null>(null);

  // Load paypal script
  // useEffect(() => {
  //   const initPaypal = async () => {
  //     loadScript({
  //       "client-id": "AdprewilBEx36JVPaJFXEvjT0W70HWqP-bgSxqV5FNNmdwK293pkp5WC4I1Y1Yq8Z1lRu37QfeusMrby"
  //     });
  //   }

  // }, []);

  const handlePaymentElementReady = (element: StripePaymentElement) => {
    paymentElement.current = element;
  };


  return (
    <>
      <h3 className="title">
        Payment Information
      </h3>

      {/* Paypal */}
      <div className="form-container">
        <div className="pricing-panel">
          <div className="payment-form-container">
            <div className="
              rounded-[5px] text-sm font-semibold box-border
              border-solid border-[1px] border-paymentelement-border
              px-4 grid grid-rows-2 items-center
            ">
              <div className="
                h-[55px] w-full
                grid grid-cols-[auto_1fr]
              ">
                {/* radio & paypal icon */}
                <div className="flex flex-row justify-center items-center">
                  <img
                    alt="pay with paypal"
                    src={selectedRadioCircleSVG}
                    width={16.8}
                    height={16.8}
                    className="mr-[10px]"
                  />
                  <div>
                    <img
                      alt="pay with paypal"
                      src={paypalPng}
                      width={16.8}
                      height={16.8}
                    />
                  </div>
                </div>

                {/* title and annotation */}
                <div className="
                  flex flex-row justify-start items-center
                  capitalize
                ">
                  <span className="font-medium">
                    paypal
                  </span>
                </div>
              </div>

              {/* content */}
              <div className="pt-1 pb-4 px-4 max-w-[300px]">
                <PayPalScriptProvider options={{
                  "client-id": "AdprewilBEx36JVPaJFXEvjT0W70HWqP-bgSxqV5FNNmdwK293pkp5WC4I1Y1Yq8Z1lRu37QfeusMrby",

                  // TODO: GBP or USD?
                  "currency": "USD",
                  "intent": "capture",
                }}>
                  <PayPalButtons style={{ layout: "horizontal" }} />
                </PayPalScriptProvider>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Stripe supported payment methods */}
      <div className="form-container">
        {/* pricing panel */}
        <div className="pricing-panel">
          <div className="payment-form-container">
            <PaymentElement
              id="payment-element"
              options={{
                layout: {
                  type: 'accordion',
                  defaultCollapsed: false,
                  radios: true,
                  spacedAccordionItems: false
                }
              }}
              onReady={handlePaymentElementReady}
            />

            <div className="confirm-payment">
              <LoadingButton
                loading={loading}
                variant="contained"
                type="submit"
                fullWidth
              >
                CONFIRM
              </LoadingButton>
            </div>

            <div className="policies-container">
              <Divider />
              <div className="policies">
                <p className="promise">
                  <span>
                    <LockIcon fontSize='small' color='success' />
                  </span>
                  We won't store any of your card information.

                </p>

                <p className="promise">
                  <span>
                    <LockIcon fontSize='small' color='success' />
                  </span>
                  You payment is under SSL protection
                </p>

                <p className="promise">
                  <span>
                    <LockIcon fontSize='small' color='success' />
                  </span>
                  We use Stripe as our payment system which exceeds the most stringent field standards for security.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>


    </>
  );
}

export default StripeCheckoutForm;
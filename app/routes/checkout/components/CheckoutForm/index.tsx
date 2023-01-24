import { useRef, useState } from 'react';
import type { LinksFunction } from '@remix-run/node';
import { PaymentElement } from '@stripe/react-stripe-js';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import LockIcon from '@mui/icons-material/Lock';
import type { StripePaymentElement, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import type { OnClickActions, OnApproveData, OnApproveActions } from "@paypal/paypal-js";

import styles from './styles/CheckoutForm.css';
import paypalPng from './images/paypal.png';
import selectedRadioCircleSVG from './images/selected_radio_circle.svg';
import unSelectedRadioCircleSVG from './images/unselected_radio_circle.svg';
import clsx from 'clsx';


export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface StripeCheckoutFormProps {
  loading?: boolean;
  paypalCreateOrder: () => Promise<string>
  paypalInputValidate?: (
    rec: Record<string, unknown>,
    actions: OnClickActions
  ) => Promise<void> | void
  paypalApproveOrder?: (
    data: OnApproveData,
    actions: OnApproveActions
  ) => {},
}

export type PaymentMethods = 'stripe_methods' | 'paypal';

// TODO:
//  - [x] error message.
//  - [x] loading icon.
//  - [x] payment form validation.
//  - [x] [To submit payment on server](https://stripe.com/docs/payments/accept-a-payment-synchronously?html-or-react=react)
function StripeCheckoutForm({
  loading = false,
  paypalCreateOrder,
  paypalApproveOrder,
  paypalInputValidate = () => { },
}: StripeCheckoutFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethods>("paypal");
  const paymentElement = useRef<StripePaymentElement | null>(null);

  // We'll skip 2 onChange invocation on PaymentElemet before we can `setSelectMethod`.
  // first caused by initial rendering for `PaymentElement` and second caused by
  // element.collapse().
  const numOfChangesToSkipForStripePaymentElement = useRef<number>(2);

  // Load paypal script
  const handlePaymentElementReady = (element: StripePaymentElement) => {
    paymentElement.current = element;
    element.collapse();
  };

  const handleStripeChangePayment = (element: StripePaymentElementChangeEvent) => {
    if (numOfChangesToSkipForStripePaymentElement.current > 0) {
      numOfChangesToSkipForStripePaymentElement.current--;
      return;
    }

    if (element.collapsed) {
      return
    }

    setSelectedMethod("stripe_methods");
  }

  const handleChoosePayPal = () => {
    paymentElement.current?.collapse();
    setSelectedMethod("paypal");
  }

  const handlePaypalCreateOrder = async (): Promise<string> => paypalCreateOrder();

  const handlePaypalApproveOrder = async (data: OnApproveData, action: OnApproveActions) => {
    if (!paypalApproveOrder) return;
    await paypalApproveOrder(data, action);
  }

  return (
    <>
      <h3 className="title mt-4">
        Payment Methods
      </h3>

      {/* Paypal */}
      <div className="form-container">
        <div className="pricing-panel">
          <div className="payment-form-container">
            <div className="
              rounded-[5px] text-sm font-semibold box-border
              border-solid border-[1px] border-paymentelement-border
              px-4 flex flex-col
            ">
              <button
                className="
                  h-[55px] w-full
                  grid grid-cols-[auto_1fr] items-center
                  border-none bg-transparent cursor-pointer outline-none
                "
                type='button'
                onClick={handleChoosePayPal}
              >
                {/* radio & paypal icon */}
                <div className="flex flex-row justify-center items-center">
                  <img
                    alt="pay with paypal"
                    src={
                      selectedMethod === 'paypal'
                        ? selectedRadioCircleSVG
                        : unSelectedRadioCircleSVG
                    }
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
              </button>

              {/* content */}
              <div
                className={
                  clsx(`
                      relative z-[1]
                      overflow-hidden h-0
                      transition-[height] ease delay-300
                    `,
                    {
                      "h-[90px]": selectedMethod === 'paypal',
                    }
                  )
                }
              >
                <div className="pt-1 pb-4 px-4 box-border">
                  <PayPalScriptProvider
                    options={{
                      "client-id": "AdprewilBEx36JVPaJFXEvjT0W70HWqP-bgSxqV5FNNmdwK293pkp5WC4I1Y1Yq8Z1lRu37QfeusMrby",

                      // TODO: GBP or USD?
                      "currency": "USD",
                      "intent": "capture",
                    }}
                  >
                    <PayPalButtons
                      onClick={paypalInputValidate}
                      createOrder={handlePaypalCreateOrder}
                      onApprove={handlePaypalApproveOrder}
                      style={{ layout: "horizontal" }}
                    />
                  </PayPalScriptProvider>
                </div>
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
              onChange={handleStripeChangePayment}
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
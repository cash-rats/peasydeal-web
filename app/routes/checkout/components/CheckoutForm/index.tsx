
import { PayPalButtons } from "@paypal/react-paypal-js";
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import { useRef, useState } from 'react';
import type { LinksFunction } from '@remix-run/node';
import type { StripePaymentElement, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import type { OnClickActions, OnApproveData, OnApproveActions, OnInitActions } from "@paypal/paypal-js";

import styles from './styles/CheckoutForm.css';
import StripeCheckout from './components/StripeCheckout';
import PaypalCheckout from './components/PaypalCheckout';


export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface StripeCheckoutFormProps {
  loading?: boolean;
  paypalDisabled?: boolean;
  paypalCreateOrder: () => Promise<string>;
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
function CheckoutForm({
  loading = false,
  paypalDisabled = true,
  paypalCreateOrder,
  paypalApproveOrder,
  paypalInputValidate = () => { },
}: StripeCheckoutFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethods>("paypal");
  const paymentElement = useRef<StripePaymentElement | null>(null);

  // We'll skip 2 onChange invocation on PaymentElemet before we can `setSelectMethod`.
  // first caused by initial rendering for `PaymentElement` and second caused by
  const numOfChangesToSkipForStripePaymentElement = useRef<number>(2);

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

      <PayPalScriptProvider
        options={{
          "client-id": "AdprewilBEx36JVPaJFXEvjT0W70HWqP-bgSxqV5FNNmdwK293pkp5WC4I1Y1Yq8Z1lRu37QfeusMrby",
          "currency": "USD",
          // "currency": PAYPAL_CURRENCY_CODE,
          "intent": "capture",
        }}
      >
        <PayPalButtons
          // disabled={paypalDisabled}
          // onInit={paypalInit}
          // onClick={paypalInputValidate}
          // createOrder={paypalCreateOrder}
          // onApprove={paypalApproveOrder}
          style={{ layout: "horizontal" }}
        />
      </PayPalScriptProvider>

      <PaypalCheckout
        collapse={selectedMethod !== 'paypal'}
        onChoose={handleChoosePayPal}

        paypalDisabled={paypalDisabled}
        paypalInputValidate={paypalInputValidate}
        paypalCreateOrder={handlePaypalCreateOrder}
        paypalApproveOrder={handlePaypalApproveOrder}
      />

      <StripeCheckout
        loading={loading}
        onChange={handleStripeChangePayment}
        onReady={handlePaymentElementReady}
      />
    </>
  );
}

export default CheckoutForm;
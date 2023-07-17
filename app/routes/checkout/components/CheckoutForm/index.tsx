import { useRef, useState } from 'react';
import type { LinksFunction } from '@remix-run/node';
import type { StripePaymentElement, StripePaymentElementChangeEvent } from '@stripe/stripe-js';
import type { OnClickActions, OnApproveData, OnApproveActions } from "@paypal/paypal-js";

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
  ) => Promise<void>,
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
  paypalApproveOrder = async (data: OnApproveData, actions: OnApproveActions) => { },
  paypalInputValidate = () => { },
}: StripeCheckoutFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethods>('paypal');
  const paymentElement = useRef<StripePaymentElement | null>(null);

  // We'll skip 2 onChange invocation on PaymentElemet before we can `setSelectMethod`.
  // first caused by initial rendering for `PaymentElement` and second caused by
  const numOfChangesToSkipForStripePaymentElement = useRef<number>(2);

  const handlePaymentElementReady = (element: StripePaymentElement) => {
    paymentElement.current = element;
    element.collapse();
  };

  const handleStripeChangePayment = (element: StripePaymentElementChangeEvent) => {
    console.log('debug 1', element.collapsed);
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

  const handlePaypalApproveOrder = async (data: OnApproveData, action: OnApproveActions) => paypalApproveOrder(data, action);

  console.log('debug 2', selectedMethod);

  return (
    <>
      <h3 className="title mt-4">
        Payment Methods
      </h3>

      <PaypalCheckout
        collapse={selectedMethod !== 'paypal'}
        onChoose={handleChoosePayPal}

        paypalDisabled={paypalDisabled}
        paypalInputValidate={paypalInputValidate}
        paypalCreateOrder={handlePaypalCreateOrder}
        paypalApproveOrder={handlePaypalApproveOrder}
      />

      <StripeCheckout
        disabled={selectedMethod !== 'stripe_methods'}
        loading={loading}
        onChange={handleStripeChangePayment}
        onReady={handlePaymentElementReady}
      />
    </>
  );
}

export default CheckoutForm;
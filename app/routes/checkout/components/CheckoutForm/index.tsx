/*
  TODOs
     - [ ] Handle create order API error.
*/
import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { json } from '@remix-run/node';
import type { LinksFunction, ActionFunction } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import type { StripeError, StripeElements, Stripe } from '@stripe/stripe-js';
import LoadingButton from '@mui/lab/LoadingButton';
import type { FormikValues } from 'formik';
import httpStatus from 'http-status-codes';

import { getBrowserDomainUrl } from '~/utils/misc';

import styles from './styles/CheckoutForm.css';
import { transformOrderDetail } from './utils';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const formObj = Object.fromEntries(form.entries());
  const { shipping_form: shippingForm, order_detail: orderDetail } = formObj;

  if (!orderDetail || !shippingForm) {
    return null;
  };

  const shippingFormObj = JSON.parse(shippingForm);
  const orderDetailObj = JSON.parse(orderDetail);

  // Transform orderDetail object to array of orders.
  const trfItems = transformOrderDetail(orderDetailObj);

  // Order amount information
  // Create new order;
  const { PEASY_DEAL_ENDPOINT } = process.env;
  const {
    email,
    firstname,
    lastname,
    address1,
    address2,
    city,
    postal,
    clientSecret,
  } = shippingFormObj;

  const resp = await fetch(`${PEASY_DEAL_ENDPOINT}/v1/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      firstname,
      lastname,
      address: address1,
      address2,
      city,
      postal,
      payment_secret: clientSecret,
      products: trfItems,
    }),
  });

  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    return json(respJSON, resp.status);
  }

  return json(respJSON, httpStatus.OK);
}

interface StripeCheckoutFormProps {
  /*
   * Perform any validations before performing checkout.
   */
  validateBeforeCheckout: () => Promise<[boolean, FormikValues] | undefined>;

  /*
   * Stripe payment result. If success, null will be given else instance of `StripeError` is given.
   */
  onPaymentResult?: (resp: any, errors: StripeError | undefined) => void;

  /*
   * Customer order detail.
   */
  orderDetail: FormikValues;

  /*
   * Stripe client secret.
   */
  clientSecret: string;
}

// TODO:
//  - [ ] error message.
//  - [ ] loading icon.
//  - [ ] payment form validation.
//  - [ ] [To submit payment on server](https://stripe.com/docs/payments/accept-a-payment-synchronously?html-or-react=react)
function StripeCheckoutForm({
  onPaymentResult = () => { },
  validateBeforeCheckout,
  orderDetail,
  clientSecret,
}: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  // Store orderID when new is created. There might be an senario where shipping information is valid but not billing info.
  // When customer submit payment again, a new order will be created again. Thus,i f orderID exists we should not create a new order again.
  const [orderID, setOrderID] = useState<string | null>();
  const createOrderFetcher = useFetcher();


  async function confirmPayment(orderID: string, elements: StripeElements, stripe: Stripe) {
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${getBrowserDomainUrl()}/checkout/result`,
      },
    });

    onPaymentResult(orderID, error);
  }

  // Only when new order has been created successfully, we will perform stripe payment.
  useEffect(() => {

    // If there are any immediate errors, show the error messasge to customer.
    if (createOrderFetcher.type === 'done' && elements && stripe) {
      const { order_id: orderID } = createOrderFetcher.data
      setOrderID(orderID);

      confirmPayment(orderID, elements, stripe);
    }

  }, [createOrderFetcher]);

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const res = await validateBeforeCheckout();

    if (!res) return;


    const [hasErrors, shippingFormValues] = res;

    if (hasErrors) return;

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    // Create an order with payment_status equals `PENDING` on backend before confirming payment
    // We can later alter the payment_status to `PAID` when payment success.
    // Moreover, we only create new payment if it has not been created.
    if (!orderID) {
      createOrderFetcher.submit({
        shipping_form: JSON.stringify({
          ...shippingFormValues,
          clientSecret,
        }),
        order_detail: JSON.stringify(orderDetail),
      }, { method: "post", action: '/checkout/components/CheckoutForm?index', replace: true });
    } else {
      confirmPayment(orderID, elements, stripe);
    }

    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />

      <div className="confirm-payment">
        <LoadingButton
          loading={isLoading}
          variant="contained"
          type="submit"
          fullWidth
        >
          CONFIRM
        </LoadingButton>
      </div>
    </form>
  );
}

export default StripeCheckoutForm;
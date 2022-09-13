import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import type { StripeError } from '@stripe/stripe-js';
import LoadingButton from '@mui/lab/LoadingButton';

import { getBrowserDomainUrl } from '~/utils/misc';

import styles from './styles/CheckoutForm.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface StripeCheckoutFormProps {
  /*
   * Perform any validations before performing checkout.
   */
  validateBeforeCheckout: () => Promise<boolean | undefined> | void;

  /*
   * Stripe payment result. If success, null will be given else instance of `StripeError` is given.
   */
  onPaymentResult?: (errors: StripeError | undefined) => void;
}

// TODO:
//  - [ ] error message.
//  - [ ] loading icon.
//  - [ ] payment form validation.
//  - [ ] [To submit payment on server](https://stripe.com/docs/payments/accept-a-payment-synchronously?html-or-react=react)
function StripeCheckoutForm({ onPaymentResult = () => { }, validateBeforeCheckout }: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    }, [stripe]);
  });

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const hasErrors = await validateBeforeCheckout();

    if (hasErrors) return;

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${getBrowserDomainUrl()}/${window.ENV.ENV.STRIPE_PAYMENT_RETURN_URI}`,
      },
    });

    setIsLoading(false);

    onPaymentResult(error);
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

      {
        message && (
          <div>
            {message}
          </div>
        )
      }
    </form>
  );
}

export default StripeCheckoutForm;
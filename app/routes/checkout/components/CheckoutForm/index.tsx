import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import Button from '@mui/material/Button';

import { getBrowserDomainUrl } from '~/utils/misc';

import styles from './styles/CheckoutForm.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

// TODO:
//  - [ ] error message.
//  - [ ] loading icon.
//  - [ ] payment form validation.
function StripeCheckoutForm() {
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

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />

      <div className="confirm-payment">
        <Button
          variant="contained"
          type="submit"
          fullWidth
        >
          CONFIRM
        </Button>
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
import { useState, useCallback } from "react";
import {
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { getBrowserDomainUrl } from '~/utils/misc';
import { PaymentMethod as PaymentMethodEnum } from '~/shared/enums';

/**
 * Custom hook for confirming Stripe payments
 */
export function useStripeConfirmPayment() {
  const [isPaying, setIsPaying] = useState(false);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);
  const elements = useElements();
  const stripe = useStripe();

  const stripeConfirmPayment = useCallback(
    async (orderUUID: string) => {
      if (!elements || !stripe) return;
      setIsPaying(true);
      try {
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${getBrowserDomainUrl()}/payment/${orderUUID}?payment_method=${PaymentMethodEnum.Stripe}`,
          },
        });

        if (error) {
          if (error.type === "card_error" || error.type === "validation_error") {
            throw new Error(error.message);
          } else {
            // TODO log to remote API if error happens
            throw new Error(`An unexpected error occurred. ${error.message}`);
          }
        }
      } catch (error: any) {
        setErrorAlert(`An unexpected error occurred. ${error.message}`);
      } finally {
        setIsPaying(false);
      }
    },
    [elements, stripe],
  );

  const clearErrorAlert = () => {
    setErrorAlert(null);
  }

  return {
    isPaying,
    errorAlert,
    clearErrorAlert,
    stripeConfirmPayment,
  };
}

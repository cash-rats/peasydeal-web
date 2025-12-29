import Stripe from 'stripe';

import { envs } from '~/utils/env';

const stripe = new Stripe(envs.STRIPE_PRIVATE_KEY, {
  apiVersion: '2022-08-01'
});

export const createPaymentIntent = ({
  amount,
  currency = 'usd'
}: { amount: number, currency: string }): Promise<Stripe.Response<Stripe.PaymentIntent>> => {
  return stripe.paymentIntents.create({
    amount,
    currency,
    metadata: { integration_check: 'accept_a_payment' },
    payment_method_types: [
      'card',
    ],
  });
}

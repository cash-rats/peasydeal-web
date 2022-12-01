import Stripe from 'stripe';

const STRIPE_PRIVATE_KEY = process.env.STRIPE_PRIVATE_KEY || '';
console.log('debug STRIPE_PRIVATE_KEY', STRIPE_PRIVATE_KEY)
const stripe = new Stripe(STRIPE_PRIVATE_KEY, {
  apiVersion: '2022-08-01'
});

export const createPaymentIntent = ({ amount, currency = 'usd' }: { amount: number, currency: string }): Promise<Stripe.Response<Stripe.PaymentIntent>> => {
  return stripe.paymentIntents.create({
    amount,
    currency,
    metadata: { integration_check: 'accept_a_payment' },
  });
}
import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData, redirect } from 'react-router';

import type { PaymentMethod } from '~/shared/types';
import { PaymentMethod as PaymentMethodEnum } from '~/shared/enums';
import StripePaymentResult from './components/StripePaymentResult';
import PaypalPaymentResult from './components/PaypalPaymentResult';

type LoaderData = {
  paymentMethod: PaymentMethodEnum;
  paypal?: {
    orderId: string;
  };
  stripe?: {
    orderId: string;
    clientSecret: string;
  };
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const paymentMethod = url.searchParams.get('payment_method') as PaymentMethod;

  const { orderId } = params;

  if (!orderId) {
    throw Response.json('404 not found');
  }

  if (paymentMethod === PaymentMethodEnum.Paypal) {
    return Response.json({
      paymentMethod: PaymentMethodEnum.Paypal,
      paypal: {
        orderId,
      },
    });
  }

  if (paymentMethod === PaymentMethodEnum.Stripe) {
    const clientSecret = url.searchParams.get('payment_intent_client_secret');

    if (!clientSecret) {
      throw redirect('/cart');
    }

    return Response.json({
      paymentMethod: PaymentMethodEnum.Stripe,
      stripe: {
        clientSecret,
        orderId,
      },
    });
  }

  throw Response.json('payment method not specified');
};

export default function PaymentResult() {
  const {
    paymentMethod,
    paypal,
    stripe,
  } = useLoaderData<LoaderData>() || {};

  if (
    paymentMethod === PaymentMethodEnum.Stripe &&
    stripe
  ) {
    return (
      <StripePaymentResult
        orderID={stripe.orderId}
        clientSecret={stripe.clientSecret}
      />
    );
  }

  if (
    paymentMethod === PaymentMethodEnum.Paypal &&
    paypal
  ) {
    return (
      <PaypalPaymentResult orderID={paypal.orderId} />
    );
  }

  return '';
}

import { type LoaderFunctionArgs, redirect } from 'react-router';
import { useLoaderData } from 'react-router';

import type { PaymentMethod } from '~/shared/types';
import { PaymentMethod as PaymentMethodEnum } from '~/shared/enums';

import StripePaymentResult from './components/StripePaymentResult';
import PaypalPaymentResult from './components/PaypalPaymentResult';

type LoaderDataType = {
  paymentMethod: PaymentMethodEnum;
  paypal?: {
    orderId: string;
  },
  stripe?: {
    orderId: string;
    clientSecret: string;
  }
}

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  // Determine which payment method the client used, perform
  // corresponding payment logic afterwards. payment method will be given
  // in query param `payment_method`. Each `payment_method` has different response
  // paypal:
  //   - order_uuid
  //   - failed, json string from paypal
  //
  // Stripe:
  //   - order_uuid
  //   - client_secret
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

    // Get stripe client secret
    return Response.json({
      paymentMethod: PaymentMethodEnum.Stripe,
      stripe: {
        clientSecret,
        orderId,
      },
    });
  }

  // Payment method not specified. We'll throw an error out.
  throw Response.json('payment method not specified');
}

export default function PaymentResult() {
  const {
    paymentMethod,
    paypal,
    stripe
  } = useLoaderData<LoaderDataType>() || {};

  if (
    paymentMethod === PaymentMethodEnum.Stripe &&
    stripe
  ) {
    return (
      <StripePaymentResult
        orderID={stripe.orderId}
        clientSecret={stripe.clientSecret}
      />
    )
  }

  if (
    paymentMethod === PaymentMethodEnum.Paypal &&
    paypal
  ) {
    return (
      <PaypalPaymentResult orderID={paypal.orderId} />
    )
  }

  // either payment method unrecognized or corresponding data object
  // is null. We should display failed page.
  return ''
}

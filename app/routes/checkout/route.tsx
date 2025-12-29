import { useEffect, useState } from 'react';
import {
  Outlet,
  useLoaderData,
  useOutletContext,
  useRouteLoaderData,
  useRouteError,
  isRouteErrorResponse,
  redirect,
} from 'react-router';
import type {
  ShouldRevalidateFunctionArgs,
  LoaderFunctionArgs,
  LinksFunction,
  MetaFunction,
} from 'react-router';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions, Stripe } from '@stripe/stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import httpStatus from 'http-status-codes';

import { tryCatch } from '~/utils/try-catch';
import { useCartCount } from '~/routes/hooks';
import { envs } from '~/utils/env';
import { getCheckoutTitleText } from '~/utils/seo';
import { createPaymentIntent } from '~/services/stripe.server';
import type { PriceInfo } from '~/shared/cart';
import {
  type CheckoutSessionData,
  setCheckoutSessionData,
  commitCheckoutSession,
  getCheckoutSession,
} from '~/sessions/checkout.session.server';
import CatalogLayout, {
  links as CatalogLayoutLinks,
} from '~/components/layouts/CatalogLayout';
import type { RootLoaderData } from '~/root';

export const meta: MetaFunction = () => [
  { title: getCheckoutTitleText() },
];

export const links: LinksFunction = () => {
  return CatalogLayoutLinks();
};

type LoaderType = {
  client_secret?: string | undefined;
  payment_intend_id: string;
  price_info: PriceInfo;
  promo_code: string | null | undefined;
};

export function shouldRevalidate(_: ShouldRevalidateFunctionArgs) {
  return false;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const [checkoutSessionResult, checkoutSessionError] = await tryCatch(
    getCheckoutSession(request),
  );

  if (checkoutSessionError || !checkoutSessionResult) {
    throw new Response('Failed to load checkout session', {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }

  const { session, data: checkoutData } = checkoutSessionResult;

  if (!checkoutData) {
    throw redirect('/cart');
  }

  const checkout = checkoutData as CheckoutSessionData;

  const {
    priceInfo,
    promoCode,
  } = checkout;

  const amount = Math.round(priceInfo.total_amount * 100);
  const currency = envs.STRIPE_CURRENCY_CODE;

  const [paymentIntentResult, paymentIntentError] = await tryCatch(
    createPaymentIntent({
      amount,
      currency,
    }),
  );

  if (paymentIntentError || !paymentIntentResult) {
    throw new Response('Failed to create payment intent', {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }

  const paymentIntent = {
    id: paymentIntentResult.id,
    clientSecret: paymentIntentResult.client_secret || '',
    amount,
    currency,
  };

  setCheckoutSessionData(session, {
    ...checkout,
  });

  const [committedCookie, commitError] = await tryCatch(
    commitCheckoutSession(session),
  );

  if (commitError || !committedCookie) {
    throw new Response('Failed to commit checkout session', {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }

  return Response.json({
    client_secret: paymentIntent?.clientSecret || undefined,
    payment_intend_id: paymentIntent?.id || '',
    price_info: priceInfo,
    promo_code: promoCode,
  }, {
    headers: { 'Set-Cookie': committedCookie },
  });
};

function CheckoutLayout() {
  const {
    client_secret: clientSecret = '',
    price_info,
    promo_code,
  } = useLoaderData<LoaderType>() || {};
  const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
  const categories = rootData?.categories ?? [];
  const navBarCategories = rootData?.navBarCategories ?? [];

  const cartCount = useCartCount();
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  // TODO: don't hardcode locale
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {},
    locale: 'en-GB',
  };

  useEffect(() => {
    if (window && envs.STRIPE_PUBLIC_KEY) {
      setStripePromise(loadStripe(envs.STRIPE_PUBLIC_KEY));
    }
  }, []);

  return (
    <CatalogLayout
      categories={categories}
      navBarCategories={navBarCategories}
      cartCount={cartCount}
    >
      {stripePromise && (
        <div className="min-h-[35rem] flex justify-center">
          <Elements
            stripe={stripePromise}
            options={options}
          >
            <PayPalScriptProvider
              options={{
                'client-id': envs.PAYPAL_CLIENT_ID,
                currency: envs.PAYPAL_CURRENCY_CODE,
                intent: 'capture',
              }}
            >
              <Outlet
                context={{
                  paymentClientSecret: clientSecret,
                  priceInfo: price_info,
                  promoCode: promo_code,
                }}
              />
            </PayPalScriptProvider>
          </Elements>
        </div>
      )}
    </CatalogLayout>
  );
}

type ContextType = {
  paymentClientSecret: string;
  priceInfo: PriceInfo;
  promoCode: string | null | undefined;
};

export function useContext() {
  return useOutletContext<ContextType>();
}

export function ErrorBoundary() {
  const error = useRouteError();
  const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
  const cartCount = useCartCount();

  const categories = rootData?.categories ?? [];
  const navBarCategories = rootData?.navBarCategories ?? [];

  const isResponseError = isRouteErrorResponse(error);

  return (
    <CatalogLayout
      categories={categories}
      navBarCategories={navBarCategories}
      cartCount={cartCount}
    >
      <div className="min-h-[35rem] flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <h1 className="text-2xl font-semibold">Unable to load checkout</h1>
        <p className="text-gray-600">
          Checkout is unavailable right now. Please try again or return to your cart.
        </p>
        {isResponseError && (
          <p className="text-sm text-gray-500">
            Error code: {error.status}
          </p>
        )}
        <div className="flex items-center gap-4">
          <a
            className="rounded bg-black px-4 py-2 text-white"
            href="/cart"
          >
            Return to cart
          </a>
          <a
            className="rounded border border-black px-4 py-2 text-black"
            href="/"
          >
            Go home
          </a>
        </div>
      </div>
    </CatalogLayout>
  );
}

export default CheckoutLayout;

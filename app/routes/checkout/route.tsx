import { useEffect, useState } from 'react';
import {
  Outlet,
  useLoaderData,
  useOutletContext,
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

import { useCartCount } from '~/routes/hooks';
import { envs } from '~/utils/env';
import { getCheckoutTitleText } from '~/utils/seo';
import { createPaymentIntent } from '~/services/stripe.server';
import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';
import type { Category } from '~/shared/types';
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

export const meta: MetaFunction = () => [
  { title: getCheckoutTitleText() },
];

export const links: LinksFunction = () => {
  return CatalogLayoutLinks();
};

type LoaderType = {
  client_secret?: string | undefined;
  payment_intend_id: string;
  categories: Category[];
  navBarCategories: Category[];
  price_info: PriceInfo;
  promo_code: string | null | undefined;
};

export function shouldRevalidate(_: ShouldRevalidateFunctionArgs) {
  return false;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { session, data: checkoutData } = await getCheckoutSession(request);

    if (!checkoutData) {
      throw redirect('/cart');
    }

    const checkout = checkoutData as CheckoutSessionData;

    const {
      priceInfo,
      promoCode,
    } = checkout;

    const [navBarCategories, categories] = await fetchCategoriesWithSplitAndHotDealInPlaced();

    const amount = Math.round(priceInfo.total_amount * 100);
    const currency = envs.STRIPE_CURRENCY_CODE;

    const newPaymentIntent = await createPaymentIntent({
      amount,
      currency,
    });

    const paymentIntent = {
      id: newPaymentIntent.id,
      clientSecret: newPaymentIntent.client_secret || '',
      amount,
      currency,
    };

    setCheckoutSessionData(session, {
      ...checkout,
    });

    return Response.json({
      client_secret: paymentIntent?.clientSecret || undefined,
      payment_intend_id: paymentIntent?.id || '',
      categories,
      navBarCategories,
      price_info: priceInfo,
      promo_code: promoCode,
    }, {
      headers: { 'Set-Cookie': await commitCheckoutSession(session) },
    });
  } catch (e) {
    throw Response.json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

function CheckoutLayout() {
  const {
    client_secret: clientSecret = '',
    categories,
    price_info,
    promo_code,
    navBarCategories,
  } = useLoaderData<LoaderType>() || {};

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

export default CheckoutLayout;

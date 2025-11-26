import { useEffect, useState } from 'react';
import {
  Outlet,
  useLoaderData,
  useOutletContext,
  useRouteLoaderData,
  redirect,
} from 'react-router';
import type {
  ShouldRevalidateFunction,
  LoaderFunctionArgs,
  LinksFunction,
  MetaFunction,
} from 'react-router';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions, Stripe } from '@stripe/stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import httpStatus from 'http-status-codes';

import { envs } from '~/utils/env';
import { getCheckoutTitleText } from '~/utils/seo';
import { createPaymentIntent } from '~/services/stripe.server';
import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';
import type { Category } from '~/shared/types';
import type { PriceInfo } from '~/shared/cart';
import {
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

export const shouldRevalidate: ShouldRevalidateFunction = ({ formAction }) => {
  if (
    formAction &&
    formAction.includes('components/ShippingDetailForm')
  ) {
    return false;
  }

  if (
    formAction &&
    formAction.includes('/checkout/result/components/Success')
  ) {
    return false;
  }

  if (
    formAction &&
    formAction.includes('/components/Header')
  ) {
    return false;
  }

  return true;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { session, data: checkoutData } = await getCheckoutSession(request);

    if (!checkoutData) {
      throw redirect('/cart');
    }

    const { priceInfo, promoCode } = checkoutData;

    const [navBarCategories, categories] =
      await fetchCategoriesWithSplitAndHotDealInPlaced();

    const paymentIntent = await createPaymentIntent({
      amount: Math.round(priceInfo.total_amount * 100),
      currency: envs.STRIPE_CURRENCY_CODE,
    });

    return Response.json({
      client_secret: paymentIntent.client_secret || undefined,
      payment_intend_id: paymentIntent.id,
      categories,
      navBarCategories,
      price_info: priceInfo,
      promo_code: promoCode,
    }, {
      headers: {
        'Set-Cookie': await commitCheckoutSession(session),
      },
    });
  } catch (e) {
    if (e instanceof Response) {
      throw e;
    }

    throw Response.json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

function CheckoutLayout() {
  const {
    client_secret: clientSecret = '',
    payment_intend_id,
    categories,
    price_info,
    promo_code,
    navBarCategories,
  } = useLoaderData<LoaderType>() || {};

  const rootData = useRouteLoaderData('root') as any;
  const cartCount = rootData?.cartCount || 0;
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {},
    locale: 'en-GB',
  };

  useEffect(() => {
    if (window && envs.STRIPE_PUBLIC_KEY) {
      setStripePromise(loadStripe(envs.STRIPE_PUBLIC_KEY));
    }
  }, [payment_intend_id]);

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
                  paymentIntendID: payment_intend_id,
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
  paymentIntendID: string;
  priceInfo: PriceInfo;
  promoCode: string | null | undefined;
};

export function useContext() {
  return useOutletContext<ContextType>();
}

export default CheckoutLayout;

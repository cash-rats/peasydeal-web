import { useEffect, useState } from 'react';
import { Form, Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import type { ShouldReloadFunction } from '@remix-run/react'
import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions, Stripe } from '@stripe/stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import {
  PAYPAL_CLIENT_ID,
  PAYPAL_CURRENCY_CODE,
} from '~/utils/get_env_source';
import CategoryContext from '~/context/categories';
import Footer, { links as FooterLinks } from '~/components/Footer';
import Header, { links as HeaderLinks } from '~/routes/components/Header';
import { createPaymentIntent } from '~/utils/stripe.server';
import { STRIPE_PUBLIC_KEY, STRIPE_CURRENCY_CODE } from '~/utils/get_env_source';
import { getCart } from '~/sessions/shoppingcart.session';
import { getTransactionObject } from '~/sessions/transaction.session';
import { fetchCategories } from '~/api/categories.server';
import type { Category } from '~/shared/types';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';
import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import type { PriceInfo } from '~/shared/cart';

import { useSearchSuggests } from './hooks/auto-complete-search';

export const links: LinksFunction = () => {
  return [
    ...FooterLinks(),
    ...HeaderLinks(),
    ...CategoriesNavLinks(),
    ...DropDownSearchBarLinks(),
  ];
};

type LoaderType = {
  client_secret?: string | undefined;
  payment_intend_id: string;
  categories: Category[];
  price_info: PriceInfo;
  promo_code: string | null | undefined;
};

export const unstable_shouldReload: ShouldReloadFunction = ({ submission }) => {
  // Loading addresses via postal in `ShipingDetailForm` will trigger loader which generates
  // a new stripe payment intend secret which causes stripe and the app uses different
  // payment secret. Stripe uses the old one and the app uses the new one. To prevent
  // payment secret inconformity, we prevent trigger loader when form submission is coming
  //  from `components/ShippingDetailForm`.
  if (
    submission
      ?.action
      .includes('components/ShippingDetailForm')
  ) {
    return false;
  }

  // Payment success would clear all items in shopping cart. It consequently
  // triggers redirection to `/cart` since shopping cart is empty causes
  // user not seeing `Success` page after payment success. The following check
  // ignores form submission coming from '/checkout/result/component/Success'
  // triggers loader.
  if (
    submission
      ?.action
      .includes('/checkout/result/components/Success')
  ) {
    return false
  }

  // Any component that request Header reload  cart item count would potentially trigger redirection
  // to `/cart` if cart has no item.
  if (
    submission
      ?.action
      .includes('/components/Header')
  ) {
    return false;
  }

  return true;
}

export const loader: LoaderFunction = async ({ request }) => {
  const transObj = await getTransactionObject(request);
  const cartItems = await getCart(request);

  if (
    !transObj ||
    !cartItems ||
    Object.keys(cartItems).length === 0
  ) {
    throw redirect("/cart");
  }

  const categories = await fetchCategories();

  // TODO this number should be coming from BE instead.
  // https://stackoverflow.com/questions/45453090/stripe-throws-invalid-integer-error
  // In stripe, the base unit is 1 cent, not 1 dollar.
  const {
    price_info: priceInfo,
    promo_code,
  } = transObj;

  // https://stackoverflow.com/questions/45453090/stripe-throws-invalid-integer-error
  // In stripe, the base unit is 1 cent, not 1 dollar.
  const paymentIntent = await createPaymentIntent({
    amount: Math.round(priceInfo.total_amount * 100),
    currency: STRIPE_CURRENCY_CODE,
  });

  return json<LoaderType>({
    client_secret: paymentIntent.client_secret || undefined,
    payment_intend_id: paymentIntent.id,
    categories,
    price_info: priceInfo,
    promo_code: promo_code,
  });
}

function CheckoutLayout() {
  const {
    /* Stripe payment intend client secret, every secret is different every time we refresh the page */
    client_secret: clientSecret = '',
    payment_intend_id,
    categories,
    price_info,
    promo_code,
  } = useLoaderData<LoaderType>();

  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [suggests, searchSuggests] = useSearchSuggests();

  const options: StripeElementsOptions = {
    // passing the client secret obtained in step 2
    clientSecret,

    // Fully customizable with appearance API.
    appearance: {},

    // Only allows england for now.
    locale: 'en-GB',
  };

  useEffect(() => {
    if (window && STRIPE_PUBLIC_KEY) {
      setStripePromise(loadStripe(STRIPE_PUBLIC_KEY));
    }
  }, [payment_intend_id]);

  return (
    <>
      <CategoryContext.Provider value={categories}>
        <Form action='/search'>
          <Header
            searchBar={
              <DropDownSearchBar
                form='index-search-product'
                placeholder='Search products by name'
                onDropdownSearch={searchSuggests}
                results={suggests}
              />
            }
            categoriesBar={<CategoriesNav categories={categories} />}
          />
        </Form>
      </CategoryContext.Provider>

      <main className="pt-20 min-h-[35rem] md:pt-36 flex justify-center">
        {
          stripePromise && (
            <Elements
              stripe={stripePromise}
              options={options}
            >
              <PayPalScriptProvider
                options={{
                  "client-id": PAYPAL_CLIENT_ID,
                  "currency": PAYPAL_CURRENCY_CODE,
                  "intent": "capture",
                }}
              >
                <Outlet context={{
                  paymentIntendID: payment_intend_id,
                  priceInfo: price_info,
                  promoCode: promo_code,
                }} />
              </PayPalScriptProvider>
            </Elements>
          )
        }
      </main>
      <Footer />
    </>
  );
};

type ContextType = {
  clientSecret: string;
  paymentIntendID: string;
  priceInfo: PriceInfo;
  promoCode: string;
};

export function useContext() {
  return useOutletContext<ContextType>();
}

export default CheckoutLayout
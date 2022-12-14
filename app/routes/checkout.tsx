import { useEffect, useState } from 'react';
import { Outlet, useLoaderData, useOutletContext } from "@remix-run/react";
import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions, Stripe } from '@stripe/stripe-js';
import { Form } from '@remix-run/react';

import CategoryContext from '~/context/categories';
import Footer, { links as FooterLinks } from '~/components/Footer';
import Header, { links as HeaderLinks } from '~/components/Header';
import { createPaymentIntent } from '~/utils/stripe.server';
import { getCart, getItemCount } from '~/sessions/shoppingcart.session';
import { fetchCategories } from '~/categories.server';
import type { Category } from '~/shared/types';
import { fetchPriceInfo, convertShoppingCartToPriceQuery } from '~/shared/cart';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';
import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';

import styles from './styles/index.css';
import { useSearchSuggests } from './hooks/auto-complete-search';

export const links: LinksFunction = () => {
  return [
    ...FooterLinks(),
    ...HeaderLinks(),
    ...CategoriesNavLinks(),
    ...DropDownSearchBarLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

type LoaderType = {
  client_secret?: string | undefined;
  payment_intend_id: string;
  categories: Category[];
  item_count: number;
  total: number;
};

export const loader: LoaderFunction = async ({ request }) => {
  const cartItems = await getCart(request);

  if (!cartItems || Object.keys(cartItems).length === 0) {
    throw redirect("/cart");
  }

  const categories = await fetchCategories();

  const itemCount = await getItemCount(request);

  // TODO this number should be coming from BE instead.
  // https://stackoverflow.com/questions/45453090/stripe-throws-invalid-integer-error
  // In stripe, the base unit is 1 cent, not 1 dollar.
  // const amount = Number(calcGrandTotal(cartItems).toFixed(2))
  const priceQuery = convertShoppingCartToPriceQuery(cartItems);
  const priceInfo = await fetchPriceInfo({ products: priceQuery });

  // Construct stripe `PaymentIntend`
  const paymentIntent = await createPaymentIntent({
    amount: Math.round(priceInfo.total_amount * 100),
    currency: 'GBP'
  });

  return json<LoaderType>({
    client_secret: paymentIntent.client_secret || undefined,
    payment_intend_id: paymentIntent.id,
    categories,
    total: priceInfo.total_amount,
    item_count: itemCount,
  });
}

type ContextType = {
  clientSecret: string;
  paymentIntendID: string;
  total: number;
};

function CheckoutLayout() {
  const {
    /* Stripe payment intend client secret, every secret is different every time we refresh the page */
    client_secret: clientSecret = '',
    payment_intend_id,
    total,
    categories,
    item_count,
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
    if (window) {
      setStripePromise(loadStripe(window.ENV.ENV.STRIPE_PUBLIC_KEY));
    }
  }, []);

  return (
    <>
      <CategoryContext.Provider value={categories}>
        <Form className="header-wrapper" action='/search'>
          <Header
            numOfItemsInCart={item_count}
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

      <main style={{ minHeight: '35rem' }} className="Checkout__main">
        {
          stripePromise && (
            <Elements
              stripe={stripePromise}
              options={options}
            >
              <Outlet context={{
                paymentIntendID: payment_intend_id,
                total,
              }} />
            </Elements>
          )
        }
      </main>

      <Footer />
    </>
  );
};

export function useContext() {
  return useOutletContext<ContextType>();
}

export default CheckoutLayout
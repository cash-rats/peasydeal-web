import { Outlet } from "@remix-run/react";
import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { getItemCount } from '~/utils/shoppingcart.session';
import Footer, { links as FooterLinks } from '~/components/Footer';
import Header, { links as HeaderLinks } from '~/components/Header';

import styles from './styles/index.css';

type LoaderType = {
  cartItemCount: number;
};

export const loader: LoaderFunction = async ({ request }) => {
  const cartItemCount = await getItemCount(request);
  return json<LoaderType>({ cartItemCount });
}

export const links: LinksFunction = () => {
  return [
    ...HeaderLinks(),
    ...FooterLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

function CartLayout() {
  const { cartItemCount } = useLoaderData<LoaderType>();

  return (
    <>
      <Header numOfItemsInCart={cartItemCount} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default CartLayout;
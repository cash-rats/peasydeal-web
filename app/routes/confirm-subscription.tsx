import { Outlet } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';

import Header, { links as HeaderLinks } from '~/routes/components/Header';
import Footer, { links as FooterLinks } from '~/components/Footer';


export const links: LinksFunction = () => {
  return [
    ...HeaderLinks(),
    ...FooterLinks(),
  ];
}

function ConfirmSubscription() {
  return (
    <>
      <Header />

      <Outlet />

      <Footer />
    </>
  )
}

export default ConfirmSubscription;
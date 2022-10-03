import { Outlet } from "@remix-run/react";
import type { LinksFunction } from '@remix-run/node';

import LogoHeader, { links as LogoHeaderLinks } from '~/components/Header/components/LogoHeader';
import Footer, { links as FooterLinks } from '~/components/Footer';

import styles from './styles/index.css';

export const links: LinksFunction = () => {
  return [
    ...FooterLinks(),
    ...LogoHeaderLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

function CartLayout() {
  return (
    <>
      <LogoHeader />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default CartLayout;
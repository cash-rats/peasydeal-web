import { Outlet } from "@remix-run/react";
import type { LinksFunction } from '@remix-run/node';

import LogoBar, { links as LogoBarLinks } from '~/components/Header/components/LogoBar';
import HeaderWrapper, { links as HeaderWrapperLinks } from '~/components/Header/components/HeaderWrapper';
import Footer, { links as FooterLinks } from '~/components/Footer';

import styles from './styles/index.css';

export const links: LinksFunction = () => {
  return [
    ...FooterLinks(),
    ...HeaderWrapperLinks(),
    ...LogoBarLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

function CartLayout() {
  return (
    <>
      <HeaderWrapper>
        <LogoBar />
      </HeaderWrapper>

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default CartLayout;
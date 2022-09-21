import { Outlet } from "@remix-run/react";
import type { LinksFunction } from '@remix-run/node';

import LogoBar, { links as LogoBarLinks } from '~/components/Header/components/LogoBar';
import styles from './styles/index.css';

export const links: LinksFunction = () => {
  return [
    ...LogoBarLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

function CartLayout() {
  return (
    <>
      <header className="header-container">
        <LogoBar />
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}

export default CartLayout;
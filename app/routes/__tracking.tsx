import type { LinksFunction } from '@remix-run/node';
import { Outlet } from "@remix-run/react";

import TrackOrderHeader, { links as TrackOrderHeaderLinks } from '~/components/Header/components/TrackOrderHeader';
import Footer, { links as FooterLinks } from '~/components/Footer';

export const links: LinksFunction = () => {
  return [
    ...FooterLinks(),
    ...TrackOrderHeaderLinks(),
  ];
};

function TrackingOrder() {
  return (
    <>
      <TrackOrderHeader />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default TrackingOrder;


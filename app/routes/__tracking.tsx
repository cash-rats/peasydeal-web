import type { LinksFunction } from '@remix-run/node';
import { Outlet } from "@remix-run/react";

import TrackOrderHeader, { links as TrackOrderHeaderLinks } from '~/components/Header/components/TrackOrderHeader';

export const links: LinksFunction = () => {
  return [
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
    </>
  );
}

export default TrackingOrder;


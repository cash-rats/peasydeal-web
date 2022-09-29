import type { LinksFunction } from '@remix-run/node';
import { Outlet } from "@remix-run/react";

import HeaderWrapper, { links as HeaderWrapperLinks } from '~/components/Header/components/HeaderWrapper';
import LogoBar, { links as LogoBarLinks } from '~/components/Header/components/LogoBar';

export const links: LinksFunction = () => {
  return [
    ...HeaderWrapperLinks(),
    ...LogoBarLinks(),
  ];
};

function TrackingOrder() {
  return (
    <>
      <HeaderWrapper>
        <LogoBar />
      </HeaderWrapper>

      <main>
        <Outlet />
      </main>
    </>
  );
}

export default TrackingOrder;


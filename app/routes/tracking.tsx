import { useState } from 'react';
import type { MouseEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';
import { Outlet, useOutletContext } from "@remix-run/react";

import TrackOrderHeader, { links as TrackOrderHeaderLinks } from '~/components/Header/components/TrackOrderHeader';
import Footer, { links as FooterLinks } from '~/components/Footer';

export const links: LinksFunction = () => {
  return [
    ...FooterLinks(),
    ...TrackOrderHeaderLinks(),
  ];
};

type ContextType = { orderNum: string };

function TrackingOrder() {
  const [orderNum, setOrderNum] = useState<ContextType>({ orderNum: '' });

  const handleOnSearch = (newOrderNum: string, evt: MouseEvent<HTMLSpanElement>) => {
    evt.preventDefault();
    setOrderNum(prev => ({ ...prev, orderNum: newOrderNum }));
  }
  const handleOnClear = () => {
    setOrderNum({ orderNum: '' });
  }

  return (
    <>
      <TrackOrderHeader
        onSearch={handleOnSearch}
        onClear={handleOnClear}
      />

      <main>
        <Outlet
          key={orderNum.orderNum}
          context={orderNum}
        />
      </main>

      <Footer />
    </>
  );
}

export function useOrderNum() {
  return useOutletContext<ContextType>();
}

export default TrackingOrder;


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
    console.log('debug * ', newOrderNum);
    // if (orderNum === newOrderNum) return;
    console.log('debug * 2', newOrderNum);
    setOrderNum(prev => ({ ...prev, orderNum: newOrderNum }));
  }

  console.log('deubg * 4 ', orderNum);

  return (
    <>
      <TrackOrderHeader onSearch={handleOnSearch} />

      <main>
        <Outlet key={orderNum.orderNum} context={orderNum} />
      </main>

      <Footer />
    </>
  );
}

export function useOrderNum() {
  return useOutletContext<ContextType>();
}

export default TrackingOrder;


import { Outlet } from '@remix-run/react';

import Header from '~/components/Header';
import Footer from '~/components/Footer';


export default function Payment() {
  return (
    <>
      <Header />

      <div className="pt-[83px] min-h-[35rem] flex justify-center">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
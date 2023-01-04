import { Outlet } from '@remix-run/react';

import Header from '~/components/Header';
import Footer from '~/components/Footer';


export default function Payment() {
  return (
    <>
      <Header />

      <div className="min-h-[35rem]">
        <Outlet />
      </div>

      <Footer />
    </>
  );
}
import type { LinksFunction } from '@remix-run/node';

import Header, { links as HeaderLinks } from '~/components/Header';
import Footer, { links as FooterLinks } from '~/components/Footer';

import PaymentFailed from './index';

export const links: LinksFunction = () => {
  return [
    ...HeaderLinks(),
    ...FooterLinks(),
  ];
};

export default (
  <>
    <Header />
    <main className="min-h-[35rem]">
      <PaymentFailed />
    </main>
    <Footer />
  </>
)
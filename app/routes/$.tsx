import FourOhFour, { links as FourOhFourLinks } from '~/components/404';
import Header, { links as HeaderLinks } from '~/components/Header';
import Footer, { links as FooterLinks } from '~/components/Footer';

import type { LinksFunction } from '@remix-run/node';
export const links: LinksFunction = () => {
  return [
    ...FourOhFourLinks(),
    ...HeaderLinks(),
    ...FooterLinks(),
  ];
};

function GlobalSplatFourOhFour() {
  return (
    <div className="pt-20">
      <Header />
      <FourOhFour />
      <Footer />
    </div>
  );
};

export default GlobalSplatFourOhFour;
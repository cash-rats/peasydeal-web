import { Link } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';

import PeasyDeal from './images/Peasydeal.png';
import styles from './styles/LogoBar.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

function LogoBar() {
  return (
    <>
      <Link to='/' className="logo">
        <img alt='peasydeal shop' src={PeasyDeal} />
      </Link>
    </>
  );
}

export default LogoBar;
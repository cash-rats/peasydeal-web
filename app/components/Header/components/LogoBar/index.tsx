import { Link } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';

import LogoJPG from './images/logo.jpg';
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
        <img alt='peasydeal shop' src={LogoJPG} />
      </Link>
    </>
  );
}

export default LogoBar;
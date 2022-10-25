import { Link } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import IconButton from '@mui/material/IconButton';
import { FiMenu } from 'react-icons/fi';

import PeasyDeal from './images/Peasydeal.png';
import styles from './styles/LogoBar.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

function LogoBar() {
  return (
    <div className="LogoBar__wrapper">
      <div className="LogoBar__menu">
        <div className="LogoBar__menu-button">
          <IconButton>
            <FiMenu fontSize={26} color='white' />
          </IconButton>
        </div>
      </div>

      <Link to='/' className="LogoBar__link">
        <img alt='peasydeal shop' src={PeasyDeal} />
      </Link>
    </div>
  );
}

export default LogoBar;
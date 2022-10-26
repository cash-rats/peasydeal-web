import type { MouseEvent } from 'react';
import { useState } from 'react';
import { Link, } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import IconButton from '@mui/material/IconButton';
import { FiMenu } from 'react-icons/fi';
import Dialog from '@mui/material/Dialog';

import PeasyDeal from './images/Peasydeal.png';
import styles from './styles/LogoBar.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

function LogoBar() {
  const [openMenu, setOpenMenu] = useState(false);

  const handleOpenMenu = () => {
    console.log('aaccc');
    setOpenMenu(true);
  }
  const handleCloseMenu = () => {
    setOpenMenu(false);
  }

  return (
    <div className="LogoBar__wrapper">
      <div className="LogoBar__menu">
        <div className="LogoBar__menu-button">
          <IconButton onClick={handleOpenMenu}>
            <FiMenu fontSize={26} color='white' />
          </IconButton>
          <Dialog
            fullScreen
            open={openMenu}
            onClose={handleCloseMenu}
          >
            <div>
              aaa
            </div>
          </Dialog>
        </div>
      </div>

      <Link to='/' className="LogoBar__link">
        <img alt='peasydeal shop' src={PeasyDeal} />
      </Link>
    </div>
  );
}

export default LogoBar;
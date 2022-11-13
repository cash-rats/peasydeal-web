import { useState, useEffect } from 'react';
import { Link, } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import { useLocation } from '@remix-run/react';
import IconButton from '@mui/material/IconButton';
import { FiMenu } from 'react-icons/fi';

// Dialog related
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';

import CategoryContext from '~/context/categories';

// import PeasyDeal from './images/peasydeal_logo.png';
import PeasyDeal from './images/peasy logo.svg';
import styles from './styles/LogoBar.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

function LogoBar() {
  const [openMenu, setOpenMenu] = useState(false);
  const location = useLocation();

  const handleOpenMenu = () => {
    setOpenMenu(true);
  }
  const handleCloseMenu = () => {
    setOpenMenu(false);
  }

  useEffect(() => {
    return () => setOpenMenu(false)
  }, [])

  useEffect(() => {
    setOpenMenu(false);
  }, [location])

  return (
    <div className="LogoBar__wrapper">
      <div className="LogoBar__menu">
        <div className="LogoBar__menu-button">
          <IconButton onClick={handleOpenMenu}>
            <FiMenu fontSize={26} color='#e6007e' />
          </IconButton>
          <Dialog
            fullWidth
            open={openMenu}
            onClose={handleCloseMenu}
            PaperProps={{ sx: { width: "86%" } }}
          >
            <div className="LogoBar__Category-container">
              <div className="LogoBar__Category-title">
                <IconButton onClick={handleCloseMenu}>
                  <CloseIcon fontSize='32' />
                </IconButton>
              </div>
              <div className="LogoBar__Category-list-wrapper">
                <h1 className="LogoBar__Category-list-title">
                  Shop By Category
                </h1>

                <CategoryContext.Consumer>
                  {(categories) => {
                    return (
                      <ul className="LogoBar__Category-list">
                        {
                          categories.map((category) => {
                            return (
                              <Link
                                prefetch='intent'
                                key={category.catId}
                                to={`/${category.title}`}
                              >
                                <li>
                                  {category.title}
                                </li>
                              </Link>
                            )
                          })
                        }
                      </ul>
                    )
                  }}
                </CategoryContext.Consumer>
              </div>
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
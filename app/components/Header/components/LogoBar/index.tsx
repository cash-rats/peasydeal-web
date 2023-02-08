import { useState, useEffect } from 'react';
import { Link, } from '@remix-run/react';
import { useLocation } from '@remix-run/react';
import IconButton from '@mui/material/IconButton';
import { FiMenu } from 'react-icons/fi';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';

import CategoryContext from '~/context/categories';

import PeasyDeal from './images/peasydeal_logo.svg';

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
    <div className="flex items-center">
      <div className="w-[42px] h-[42px]">
        <div className="block md:hidden">
          <IconButton onClick={handleOpenMenu}>
            <FiMenu fontSize={26} color='#e6007e' />
          </IconButton>

          <Dialog
            fullWidth
            open={openMenu}
            onClose={handleCloseMenu}
            PaperProps={{ sx: { width: "86%" } }}
          >
            <div>
              <div className="p-2">
                <IconButton onClick={handleCloseMenu}>
                  <CloseIcon style={{ fontSize: 32 }} />
                </IconButton>
              </div>
              <div>
                <h1 className="m-0 py-2 px-4 text-lg bg-white-smoke text-dune font-bold uppercase ">
                  Shop By Category
                </h1>

                <CategoryContext.Consumer>
                  {(categories) => (
                    <ul>
                      {
                        categories.map((category) => {
                          return (
                            <Link
                              // prefetch='intent'
                              key={category.catId}
                              to={`/${category.name}`}
                            >
                              <li className="py-3 px-4 cursor-pointer hover:bg-gray-hover-bg">
                                {category.title}
                              </li>
                            </Link>
                          )
                        })
                      }
                    </ul>
                  )}
                </CategoryContext.Consumer>
              </div>
            </div>
          </Dialog>
        </div>
      </div>

      <Link to='/' className="leading-[20px] w-[173px] h-[60px] left-10 top-[10px] flex items-center">
        <picture>
          <source type="image/svg+xml" srcSet={PeasyDeal} />
          <img alt='PeasyDeal Logo' src={PeasyDeal} />
        </picture>
      </Link>
    </div>
  );
}

export default LogoBar;
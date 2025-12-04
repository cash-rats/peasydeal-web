import {
  type ReactNode,
  useRef,
  useState,
} from 'react';

import type { Category } from '~/shared/types';
import LogoHeader from "./components/LogoHeader";
import NavBar from './components/NavBar';
import PropBar from './components/PropBar';

export interface HeaderProps {
  categoriesBar?: ReactNode;

  mobileSearchBar?: ReactNode;

  searchBar?: ReactNode;

  categories?: Category[];

  /*
   * Number of items in shopping cart. Display `RedDot` indicator on shopping cart icon.
   */
  numOfItemsInCart?: number;

  hidePropBar?: boolean;
};

function Header({
  categoriesBar,
  mobileSearchBar,
  searchBar,
  categories = [],
  numOfItemsInCart = 0,
  hidePropBar = false,
}: HeaderProps) {
  const [openMobileSearchBar, setOpenMobileSearchBar] = useState<boolean>(false);
  const navBarRef = useRef<HTMLInputElement>(null);

  return (
    <div className='relative'>
      <div
        ref={navBarRef}
        className={`
          fixed z-30
          w-full
          flex flex-col
        `}
      >
        <LogoHeader
          categories={categories}
          searchBar={searchBar}
          mobileSearchBar={mobileSearchBar}
          openMobileSearchBar={openMobileSearchBar}

          // right status bar, cart, search icon...etc
          navBar={
            <div className="flex flex-1 px-2 md:pl-4 md:w-[15%]">
              <div className="">
                <NavBar
                  cartItemCount={numOfItemsInCart}
                  toggleOpenMobileSearchBar={() => setOpenMobileSearchBar(!openMobileSearchBar)}
                />
              </div>
            </div>
          }

          // bottom category bar
          categoriesBar={categoriesBar}
        />
      </div>

      {
        hidePropBar
          ? (<div className="pt-[60px] md:pt-[120px]" />)
          : (
            <div className='flex pt-[60px] md:pt-[120px]'>
              <PropBar />
            </div>
          )
      }
    </div>
  );
};

export default Header;

import type { ReactNode } from 'react';
import type { LinksFunction } from '@remix-run/node';

import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';

import LogoHeader, { links as LogoHeaderLinks } from "./components/LogoHeader";
import NavBar, { links as NavBarLinks } from './components/NavBar';

import styles from './styles/Header.css';

export const links: LinksFunction = () => {
  return [
    { href: styles, rel: 'stylesheet' },
    ...DropDownSearchBarLinks(),
    ...LogoHeaderLinks(),
    ...NavBarLinks(),
  ];
};

interface HeaderProps {
  categoriesBar?: ReactNode;

  /*
   * Number of items in shopping cart. Display `RedDot` indicator on shopping cart icon.
   */
  numOfItemsInCart?: number;
}

function Header({ categoriesBar, numOfItemsInCart = 0 }: HeaderProps) {
  return (
    <LogoHeader categoriesBar={categoriesBar} >
      <div className="Header__content">

        {/* search bar */}
        <div className="Header__search-bar">
          <DropDownSearchBar />
        </div>

        {/* right status bar, cart, search icon...etc */}
        <div className="Header__nav-bar">
          <div className="Header__nav-bar-wrapper">
            <NavBar cartItemCount={numOfItemsInCart} />
          </div>
        </div>
      </div>
    </LogoHeader>
  );
};

export default Header;

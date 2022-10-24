import type { ReactNode } from 'react';
import type { LinksFunction } from '@remix-run/node';

import DropDownSearchBar, { links as DropDownSearchBarLinks, SuggestItem } from '~/components/DropDownSearchBar';
import { useSearchSuggests } from '~/routes/auto-complete-search';
import type { SearchSuggest } from '~/routes/auto-complete-search';

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

  useSearchSuggests?: () => [SuggestItem[], SearchSuggest];
}

function Header({
  categoriesBar,
  numOfItemsInCart = 0,
  useSearchSuggests = () => ([[], () => { }]),
}: HeaderProps) {
  const [suggests, searchSuggests] = useSearchSuggests();

  return (
    <LogoHeader categoriesBar={categoriesBar} >
      <div className="Header__content">

        {/* search bar */}
        <div className="Header__search-bar">
          <DropDownSearchBar
            placeholder='Search products by name'
            onDropdownSearch={searchSuggests}
            results={suggests}
          />
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

import type { ReactNode, MouseEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';

import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import type { SuggestItem } from '~/components/DropDownSearchBar';
import type { SearchSuggest } from '~/routes/hooks/auto-complete-search';

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

  form?: string | undefined;

  /*
   * Number of items in shopping cart. Display `RedDot` indicator on shopping cart icon.
   */
  numOfItemsInCart?: number;

  useSearchSuggests?: () => [SuggestItem[], SearchSuggest];

  onSearch?: (query: string, evt: MouseEvent<HTMLButtonElement>) => void;
};

function Header({
  form,
  categoriesBar,
  numOfItemsInCart = 0,
  useSearchSuggests = () => ([[], () => { }]),
  onSearch = () => { },
}: HeaderProps) {
  const [suggests, searchSuggests] = useSearchSuggests();

  return (
    <LogoHeader categoriesBar={categoriesBar} >
      <div className="Header__content">
        {/* search bar */}
        <div className="Header__search-bar">
          <DropDownSearchBar
            form={form}
            placeholder='Search products by name'
            onDropdownSearch={searchSuggests}
            results={suggests}
            onSearch={onSearch}
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

import { useState } from 'react';
import type { ReactNode, MouseEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';

import DropDownSearchBar, { links as DropDownSearchBarLinks } from '~/components/DropDownSearchBar';
import type { SuggestItem } from '~/shared/types';
import type { SearchSuggest } from '~/routes/hooks/auto-complete-search';
import MobileSearchDialog, { links as MobileSearchDialogLinks } from '~/components/MobileSearchDialog'
import { fetchProductsByCategory } from '~/api';

import LogoHeader, { links as LogoHeaderLinks } from "./components/LogoHeader";
import NavBar, { links as NavBarLinks } from './components/NavBar';

import styles from './styles/Header.css';

export const links: LinksFunction = () => {
  return [
    { href: styles, rel: 'stylesheet' },
    ...MobileSearchDialogLinks(),
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

  onSearch?: (query: string) => void;

  onClickMobileSearch?: (evt: MouseEvent<HTMLButtonElement>) => void;
};

function Header({
  form,
  categoriesBar,
  numOfItemsInCart = 0,
  useSearchSuggests = () => ([[], () => { }]),
  onSearch = () => { },
  onClickMobileSearch = () => { }

}: HeaderProps) {
  const [suggests, searchSuggests] = useSearchSuggests();
  const [openSearchDialog, setOpenSearchDialog] = useState(false);

  const handleOnClickMobileSearch = () => {
    setOpenSearchDialog(true);
  };

  const handleClose = () => {
    setOpenSearchDialog(false);
  }

  const handleSearchRequest = async (query: string): Promise<SuggestItem[]> => {
    const products = await fetchProductsByCategory({ title: query });

    let suggestItems: SuggestItem[] = [];

    if (products.length > 0) {
      // Transform product result to suggest item.
      suggestItems = products.map<SuggestItem>((product) => {
        return {
          title: product.title,
          data: {
            title: product.title,
            image: product.main_pic,
            discount: product.discount,
            productID: product.productUUID,
          },
        };
      });
    }

    return suggestItems;
  }

  return (
    <>
      <MobileSearchDialog
        onBack={handleClose}
        open={openSearchDialog}
        onSearchRequest={handleSearchRequest}
        onSearch={onSearch}
      />

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
              <NavBar
                cartItemCount={numOfItemsInCart}
                onClickSearch={handleOnClickMobileSearch}
              />
            </div>
          </div>
        </div>
      </LogoHeader>
    </>
  );
};

export default Header;

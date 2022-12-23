import { useState } from 'react';
import type { ReactNode } from 'react';
import type { LinksFunction } from '@remix-run/node';

import type { SuggestItem } from '~/shared/types';
import MobileSearchDialog from '~/components/MobileSearchDialog'
import { fetchProductsByCategory } from '~/api';

import LogoHeader from "./components/LogoHeader";
import NavBar, { links as NavBarLinks } from './components/NavBar';

export const links: LinksFunction = () => {
  return [...NavBarLinks(),];
};

interface HeaderProps {
  categoriesBar?: ReactNode;

  searchBar?: ReactNode;

  form?: string | undefined;

  /*
   * Number of items in shopping cart. Display `RedDot` indicator on shopping cart icon.
   */
  numOfItemsInCart?: number;

  onSearch?: (query: string) => void;
};

function Header({
  form,
  categoriesBar,
  searchBar,
  numOfItemsInCart = 0,
  onSearch = () => { },
}: HeaderProps) {
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

      <LogoHeader
        // center search bar
        searchBar={searchBar}

        // right status bar, cart, search icon...etc
        navBar={
          <div className="flex flex-1 justify-end pl-4 md:w-[15%] md:justify-start">
            <div className="flex items-center md:w-full">
              <NavBar
                cartItemCount={numOfItemsInCart}
                onClickSearch={handleOnClickMobileSearch}
              />
            </div>
          </div>
        }

        // bottom category bar
        categoriesBar={categoriesBar}
      />

    </>
  );
};

export default Header;

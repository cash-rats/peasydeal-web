import { useRef, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { LinksFunction } from '@remix-run/node';

import type { SuggestItem } from '~/shared/types';
import MobileSearchDialog from '~/components/MobileSearchDialog'
import { fetchProductsByCategory } from '~/api';
import useCheckScrolled from '~/hooks/useCheckScrolled';

import AnnouncementBanner from './components/AnnouncementBanner';
import LogoHeader from "./components/LogoHeader";
import NavBar, { links as NavBarLinks } from './components/NavBar';
import PropBar from './components/PropBar';

export const links: LinksFunction = () => {
  return [...NavBarLinks(),];
};

type HeaderType = 'product_search' | 'order_search';

export interface HeaderProps {
  categoriesBar?: ReactNode;

  searchBar?: ReactNode;

  /*
   * Number of items in shopping cart. Display `RedDot` indicator on shopping cart icon.
   */
  numOfItemsInCart?: number;

  onSearch?: (query: string) => void;

  mobileSearchBarPlaceholder?: string;

  // headerType effects how `onClickMobileSearchBar` is handled.
  // when we are at `/tracking`, we don't want to open the search dialog
  // like other pages.
  // When `HeaderType` is 'order_search' the search bar will be an normal input.
  // When it's 'product_search' the search bar will open `MobileSearchDialog`.
  headerType?: HeaderType;
};

function Header({
  categoriesBar,
  searchBar,
  numOfItemsInCart = 0,
  onSearch = () => { },
  mobileSearchBarPlaceholder,
  headerType = 'product_search',
}: HeaderProps) {
  const announcementHeight = 52;
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [openAnnouncement, setOpenAnnouncement] = useState<boolean>(true);
  const [navBarHeight, setNavBarHeight] = useState(0);
  const [announcementBarHeight, setAnnouncementBarHeight] = useState(announcementHeight);

  const [scrolled, offset] = useCheckScrolled(announcementBarHeight);
  const navBarRef = useRef<HTMLInputElement>(null);
  const announcementBarRef = useRef<HTMLInputElement>(null);
  const fixedTop = scrolled || !openAnnouncement ? 0 : announcementBarHeight - offset;

  console.log(announcementBarHeight, navBarHeight)

  useEffect(() => {
    setNavBarHeight(navBarRef!.current!.clientHeight);
    setAnnouncementBarHeight(announcementBarRef!.current!.clientHeight);
  }, []);

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

  const onClickMobileSearchHandler = headerType === 'order_search'
    ? () => { }
    : handleOnClickMobileSearch;

  return (
    <div className='relative'>
      <MobileSearchDialog
        onBack={handleClose}
        open={openSearchDialog}
        onSearchRequest={handleSearchRequest}
        onSearch={onSearch}
      />

      <div
        ref={announcementBarRef}
        className={`fixed top-0 w-full ${!openAnnouncement ? 'hidden': 'flex'}`}
      >
        <AnnouncementBanner
          open={openAnnouncement}
          onClose={() => setOpenAnnouncement(false)}
        />
      </div>

      <div
        ref={navBarRef}
        className={`
          fixed z-20
          w-full
          flex flex-col
        `}
        style={{ top: `${fixedTop}px` }}
      >
        <LogoHeader
          searchBar={searchBar}
          onClickMobileSearchBar={onClickMobileSearchHandler}
          mobileSearchBarPlaceHolder={mobileSearchBarPlaceholder}
          disableMobileSearchBar={headerType === 'product_search'}

          // right status bar, cart, search icon...etc
          navBar={
            <div className="flex flex-1 px-4 md:w-[15%]">
              <div className="ml-auto">
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
      </div>

      <div style={{ paddingTop: `${navBarHeight + fixedTop}px`}}>
        <PropBar />
      </div>
    </div>
  );
};

export default Header;

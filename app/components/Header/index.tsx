import { useRef, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { LinksFunction } from '@remix-run/node';

import type { Category } from '~/shared/types';
import useCheckScrolled from '~/hooks/useCheckScrolled';

import AnnouncementBanner from './components/AnnouncementBanner';
import LogoHeader from "./components/LogoHeader";
import NavBar, { links as NavBarLinks } from './components/NavBar';
import PropBar from './components/PropBar';

export const links: LinksFunction = () => {
  return [...NavBarLinks()];
};

export interface HeaderProps {
  categoriesBar?: ReactNode;

  mobileSearchBar?: ReactNode;

  searchBar?: ReactNode;

  categories?: Category[];

  /*
   * Number of items in shopping cart. Display `RedDot` indicator on shopping cart icon.
   */
  numOfItemsInCart?: number;
};

function Header({
  categoriesBar,
  mobileSearchBar,
  searchBar,
  categories = [],
  numOfItemsInCart = 0,
}: HeaderProps) {

  const announcementHeight = 52;
  const [openAnnouncement, setOpenAnnouncement] = useState<boolean>(true);
  const [navBarHeight, setNavBarHeight] = useState(125);
  const [announcementBarHeight, setAnnouncementBarHeight] = useState(announcementHeight);

  const [scrolled, offset] = useCheckScrolled(announcementBarHeight);
  const navBarRef = useRef<HTMLInputElement>(null);
  const announcementBarRef = useRef<HTMLInputElement>(null);
  const fixedTop = scrolled || !openAnnouncement ? 0 : announcementBarHeight - offset;

  useEffect(() => {
    setNavBarHeight(navBarRef!.current!.clientHeight);
    setAnnouncementBarHeight(announcementBarRef!.current!.clientHeight);
  }, [categoriesBar]);

  return (
    <div className='relative'>
      <div
        ref={announcementBarRef}
        className={`fixed z-19 top-0 w-full ${!openAnnouncement ? 'hidden' : 'flex'}`}
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
          categories={categories}
          searchBar={searchBar}
          mobileSearchBar={mobileSearchBar}

          // right status bar, cart, search icon...etc
          navBar={
            <div className="flex flex-1 px-2 md:pl-4 md:w-[15%]">
              <div className="">
                <NavBar
                  cartItemCount={numOfItemsInCart}
                />
              </div>
            </div>
          }

          // bottom category bar
          categoriesBar={categoriesBar}
        />
      </div>

      <div style={{ paddingTop: `${navBarHeight + fixedTop}px` }}>
        <PropBar />
      </div>
    </div>
  );
};

export default Header;

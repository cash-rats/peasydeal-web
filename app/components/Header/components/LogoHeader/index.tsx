import { useState } from 'react';
import type { ReactNode, CSSProperties, MouseEvent } from 'react';

import useCheckScrolled from '~/hooks/useCheckScrolled';
import LogoBar from '~/components/Header/components/LogoBar';
import SearchBar from '~/components/SearchBar';

import AnnouncementBanner from './components/AnnouncementBanner';

interface LogoHeaderProps {
  searchBar?: ReactNode;
  navBar?: ReactNode;
  categoriesBar?: ReactNode;
  style?: CSSProperties | undefined;
  disableMobileSearchBar: boolean;

  mobileSearchBarPlaceHolder?: string;
  onClickMobileSearchBar?: { (evt: MouseEvent<HTMLDivElement>): void };
};


// Wraps Logo and
function LogoHeader({
  searchBar = null,
  navBar = null,
  categoriesBar = null,
  style,
  mobileSearchBarPlaceHolder = 'Search keywords...',
  onClickMobileSearchBar,
  disableMobileSearchBar,
}: LogoHeaderProps) {
  const [openAnnouncement, setOpenAnnouncement] = useState<boolean>(true);
  const [scrolled] = useCheckScrolled();

  return (
    <header
      style={style}
      className={`
        ${openAnnouncement &&
          !scrolled
          ? 'h-[159px]'
          : 'h-[110px]'
        } w-full
        flex flex-col
        border-b border-header-border box-border
        fixed top-0  z-10 `}
    >

      <AnnouncementBanner
        open={openAnnouncement}
        onClose={() => setOpenAnnouncement(false)}
      />

      <div className={`w-full box-border
        bg-white my-0 mx-auto ${scrolled ? 'z-10' : ''}
        flex flex-col justify-center items-center
        `}
      >
        <div className="w-full h-full grid grid-cols-[220px_auto] md:grid-cols-[220px_4fr_1fr]">
          <LogoBar />

          {
            searchBar && (
              <div className="hidden md:flex md:items-center md:py-0 md:px-1">
                {searchBar}
              </div>
            )
          }

          <div className="flex items-center">
            {navBar}
          </div>
        </div>

        <div className="w-full py-1 px-2 bg-white md:hidden">
          <SearchBar
            placeholder={mobileSearchBarPlaceHolder}
            onClick={onClickMobileSearchBar}
            disabled={disableMobileSearchBar}
          />
        </div>
      </div>

      {
        categoriesBar && (
          <div className="
            border-t-[1px] border-t-[rgba(0,0,0,.17)]
            border-b-[1px] border-b-[rgba(0,0,0,.1)]
            border-solid
            w-full
            bg-slate-50"
          >
            {categoriesBar}
          </div>
        )
      }
    </header>
  )
}

export default LogoHeader;
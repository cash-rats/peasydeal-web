import type { ReactNode, CSSProperties, MouseEvent } from 'react';

import LogoBar from '~/components/Header/components/LogoBar';
import SearchBar from '~/components/SearchBar';

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
  return (
    <header
      style={style}
      className="h-[120px] flex flex-col border-b border-header-border fixed top-0 w-full z-10 box-border"
    >
      <div className="w-full box-border
        bg-white my-0 mx-auto
        flex flex-col justify-center items-center
        "
      >
        <div className="w-full h-full grid grid-cols-[220px_auto] md:grid-cols-[220px_3fr_1fr]">
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
          <div className="w-full bg-gallery">
            {categoriesBar}
          </div>
        )
      }

    </header>
  )
}

export default LogoHeader;
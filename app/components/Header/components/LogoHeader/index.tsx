import type { ReactNode, CSSProperties, MouseEvent } from 'react';

import LogoBar from '~/components/Header/components/LogoBar';
import SearchBar from '~/components/SearchBar';

interface LogoHeaderProps {
  searchBar?: ReactNode;
  navBar?: ReactNode;
  categoriesBar?: ReactNode;
  style?: CSSProperties | undefined;

  mobileSearchBarPlaceHolder?: string;
  onClickMobileSearchBar: { (evt: MouseEvent<HTMLDivElement>): void }
};


// Wraps Logo and
function LogoHeader({
  searchBar = null,
  navBar = null,
  categoriesBar = null,
  style,
  mobileSearchBarPlaceHolder = 'Search keywords...',
  onClickMobileSearchBar = () => { },
}: LogoHeaderProps) {
  return (
    <header style={style} className="flex flex-col border-b border-header-border fixed top-0 w-full z-10 box-border">
      <div className="w-full box-border
        bg-white my-0 mx-auto
        flex flex-col justify-center items-center
        "
      >
        <div className="w-full h-full grid grid-cols-[220px_auto] md:grid-cols-[220px_3fr_1fr]">
          <LogoBar />

          {
            searchBar && (
              <div className="hidden md:flex md:items-center md:py-0 md:px-1 ">
                {searchBar}
              </div>
            )
          }

          <div className="flex items-center">
            {navBar}
          </div>
        </div>

        <div className="w-full 540:hidden py-1 px-2 bg-white">
          <SearchBar
            placeholder={mobileSearchBarPlaceHolder}
            onClick={onClickMobileSearchBar}
            disabled
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
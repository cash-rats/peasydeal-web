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
    >
      <div className="bg-white flex justify-center">
        <div className={`
          box-border
          z-10
          flex flex-col justify-center items-center
          items-center max-w-screen-xl w-full mx-8 my-auto relative
        `}>
          <div className="flex w-full justify-between">
            <LogoBar />
            {
              searchBar && (
                <div className="hidden md:flex md:items-center md:py-0 md:px-1 w-full">
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
      </div>


      {
        categoriesBar && (
          <div className="
            border-t-[1px] border-t-[rgba(0,0,0,.17)]
            border-b-[1px] border-b-[rgba(0,0,0,.1)]
            border-solid
            w-full
            bg-slate-100"
          >
            {categoriesBar}
          </div>
        )
      }
    </header>
  )
}

export default LogoHeader;
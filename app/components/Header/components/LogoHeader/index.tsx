import type { ReactNode, CSSProperties } from 'react';

import LogoBar from '~/components/Header/components/LogoBar';

interface LogoHeaderProps {
  searchBar?: ReactNode;
  navBar?: ReactNode;
  categoriesBar?: ReactNode;
  mobileSearchBar?: ReactNode;
  style?: CSSProperties | undefined;
};

// Wraps Logo and
function LogoHeader({
  searchBar = null,
  navBar = null,
  categoriesBar = null,
  style,

  mobileSearchBar,

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
          max-w-screen-xl w-full
          mx-1 md:mx-4
          mb-1
          mt-3 md:mt-1
          relative
        `}>
          <div className="flex w-full justify-between">
            <LogoBar />
            {
              searchBar && (
                <div className="
                  hidden md:flex
                  md:items-center
                  md:py-0
                  md:px-1
                  w-full">
                  {searchBar}
                </div>
              )
            }

            <div className="flex items-center">
              {navBar}
            </div>
          </div>

          {
            mobileSearchBar && (
              <div className="w-full py-1 px-2 bg-white md:hidden">
                {mobileSearchBar}
              </div>
            )
          }
        </div>
      </div>

      {
        categoriesBar && (
          <div className="
            border-t-[1px] border-t-[rgba(0,0,0,.17)]
            border-solid
            w-full
            bg-slate-100
            flex justify-center
          ">
            {categoriesBar}
          </div>
        )
      }
    </header>
  )
}

export default LogoHeader;
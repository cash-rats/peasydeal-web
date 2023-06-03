import type { ReactNode, CSSProperties } from 'react';
import { Form } from '@remix-run/react';

import type { Category } from '~/shared/types';
import LogoBar from '~/components/Header/components/LogoBar';

interface LogoHeaderProps {
  searchBar?: ReactNode;
  navBar?: ReactNode;
  categoriesBar?: ReactNode;
  mobileSearchBar?: ReactNode;
  categories?: Category[];
  style?: CSSProperties | undefined;
  openMobileSearchBar: boolean;
};

// Wraps Logo and
function LogoHeader({
  searchBar = null,
  navBar = null,
  categoriesBar = null,
  mobileSearchBar,
  openMobileSearchBar = false,
  categories = [],
  style,
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
            <LogoBar categories={categories} />
            {
              searchBar && (
                <div className="
                  hidden md:flex
                  md:items-center
                  md:py-0
                  md:px-1
                  w-full">

                  <div className="w-full flex items-center">
                    {searchBar}
                  </div>
                </div>
              )
            }

            <div className="flex items-center">
              {navBar}
            </div>
          </div>

          {
            mobileSearchBar && openMobileSearchBar && (
              <div className="w-full py-1 px-2 bg-white md:hidden">
                <div className="w-full flex items-center">
                  {mobileSearchBar}
                </div>
              </div>
            )
          }
        </div>
      </div>

      {
        categoriesBar && (
          <div className="
            border-t-[1px] border-t-[rgba(0,0,0,.17)]
            border-b-[1px] border-b-[rgba(0,0,0,.17)]
            border-solid
            w-full
            bg-slate-100
            flex justify-center
          ">
            {categoriesBar}
          </div>
        )
      }
    </header >
  )
}

export default LogoHeader;
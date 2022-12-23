import type { ReactNode, CSSProperties } from 'react';
import type { LinksFunction } from '@remix-run/node';

import LogoBar, { links as LogoBarLinks } from '~/components/Header/components/LogoBar';

import HeaderWrapper from "../HeaderWrapper";

export const links: LinksFunction = () => {
  return [...LogoBarLinks()];
};

interface LogoHeaderProps {
  searchBar?: ReactNode;

  navBar?: ReactNode;

  categoriesBar?: ReactNode;
  style?: CSSProperties | undefined;
};


// Wraps Logo and
function LogoHeader({
  searchBar = null,
  navBar = null,
  categoriesBar = null,
  style,
}: LogoHeaderProps) {
  return (
    <HeaderWrapper
      categoryBar={categoriesBar}
      style={style}
    >
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
    </HeaderWrapper>
  )
}

export default LogoHeader;
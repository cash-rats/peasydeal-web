import type { ReactNode, CSSProperties } from 'react';
import type { LinksFunction } from '@remix-run/node';

import LogoBar, { links as LogoBarLinks } from '~/components/Header/components/LogoBar';

import styles from './styles/LogoHeader.css';
import HeaderWrapper, { links as HeaderWarpperLinks } from "../HeaderWrapper";

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
    ...LogoBarLinks(),
    ...HeaderWarpperLinks(),
  ];
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
          <div className="LogoHeader__searchBar-mq">
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
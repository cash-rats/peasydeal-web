import type { ReactNode, CSSProperties } from 'react';
import type { LinksFunction } from '@remix-run/node';

import LogoBar, { links as LogoBarLinks } from '~/components/Header/components/LogoBar';

import HeaderWrapper, { links as HeaderWarpperLinks } from "../HeaderWrapper";

export const links: LinksFunction = () => {
  return [
    ...LogoBarLinks(),
    ...HeaderWarpperLinks(),
  ];
};

interface LogoHeaderProps {
  children?: ReactNode;
  categoriesBar?: ReactNode;
  style?: CSSProperties | undefined;
};

function LogoHeader({
  children = null,
  categoriesBar = null,
  style,
}: LogoHeaderProps) {
  return (
    <HeaderWrapper
      categoryBar={categoriesBar}
      style={style}
    >
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          width: '10rem',
        }}
      >
        <LogoBar />
      </div>

      {children}
    </HeaderWrapper>
  )
}

export default LogoHeader;
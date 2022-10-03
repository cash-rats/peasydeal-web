
import type { ReactElement } from 'react';
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
  children?: ReactElement | ReactElement[];
};

function LogoHeader({ children = <></> }: LogoHeaderProps) {
  return (
    <HeaderWrapper>
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <LogoBar />
      </div>

      {children}
    </HeaderWrapper>
  )
}

export default LogoHeader;
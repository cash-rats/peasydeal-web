import type { MouseEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';

import SearchBar, { links as SearchBarLinks } from '~/components/SearchBar';
import LogoHeader, { links as LogoHeaderLinks } from "~/components/Header/components/LogoHeader";

import styles from './styles/TrackOrderHeader.css';
// import LogoBar, { links as LogoBarLinks } from '../Header/components/LogoBar';
import HeaderWrapper, { links as HeaderWrapperLinks } from '../Header/components/HeaderWrapper';

export const links: LinksFunction = () => {
  return [
    ...SearchBarLinks(),
    ...LogoHeaderLinks(),
    ...HeaderWrapperLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

interface TrackOrderHeaderProps {
  onSearch: (orderNum: string, evt: MouseEvent<HTMLSpanElement>) => void;
  onClear?: (evt: MouseEvent<HTMLSpanElement>) => void;
}

function TrackOrderHeader({ onSearch, onClear }: TrackOrderHeaderProps) {
  return (
    <>
      <LogoHeader>
        <div className="search-bar-container">
          <SearchBar
            onSearch={onSearch}
            onClear={onClear}
            placeholder="Search order id "
          />
        </div>
      </LogoHeader>
    </>
    // <HeaderWrapper>
    //   <div className="track-order-header">
    //     <div className="logo-bar-container">
    //       <LogoBar />
    //     </div>
    //     <div className="search-bar-container">
    //       <SearchBar
    //         onSearch={onSearch}
    //         onClear={onClear}
    //         placeholder="Search order id "
    //       />
    //     </div>
    //   </div>
    // </HeaderWrapper>
  );
}

export default TrackOrderHeader;
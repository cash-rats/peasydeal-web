import type { LinksFunction } from '@remix-run/node';

import SearchBar, { links as SearchBarLinks } from '~/components/SearchBar';

import styles from './styles/TrackOrderHeader.css';
import LogoBar, { links as LogoBarLinks } from '../LogoBar';
import HeaderWrapper, { links as HeaderWrapperLinks } from '../HeaderWrapper';

export const links: LinksFunction = () => {
  return [
    ...SearchBarLinks(),
    ...LogoBarLinks(),
    ...HeaderWrapperLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

function TrackOrderHeader() {
  return (
    <HeaderWrapper>
      <div className="track-order-header">
        <div className="logo-bar-container">
          <LogoBar />
        </div>
        <div className="search-bar-container">
          <SearchBar />
        </div>
      </div>
    </HeaderWrapper>
  );
}

export default TrackOrderHeader;
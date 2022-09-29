import LogoBar from '../LogoBar';
import HeaderWrapper from '../HeaderWrapper';
import SearchBar from '../../../SearchBar';
import type { LinksFunction } from '@remix-run/node';

import styles from './styles/TrackOrderHeader.css';

export const links: LinksFunction = () => {
  return [
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
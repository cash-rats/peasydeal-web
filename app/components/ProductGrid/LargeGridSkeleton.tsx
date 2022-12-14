import type { LinksFunction } from '@remix-run/node';

import PlaceHolder from './images/placeholder.svg';
import styles from './styles/LargeGrid.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export default function LargeGridSkeleton() {
  return (
    <div className='large-grid-container'>
      <div className="image-container">
        <img
          alt='loading'
          src={PlaceHolder}
          className='large-grid-image'
        />
      </div>
    </div>
  );
};
import type { LinksFunction } from '@remix-run/node';

import styles from './styles/LargeGrid.css?url';

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
          src='/images/placeholder.svg'
          className='large-grid-image'
        />
      </div>
    </div>
  );
};
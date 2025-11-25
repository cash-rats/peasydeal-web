import type { LinksFunction } from 'react-router';

import styles from './styles/MediumGrid.css?url';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

// The responsive mechanism should be the same as medium grid.
export default function MediumGridSkeleton() {
  return (
    <div className="medium-grid-container">
      <div className="image-container">
        <img
          src='/images/placeholder.svg'
          alt="loading"
          className="medium-grid-image"
        />
      </div>
    </div>
  );
}
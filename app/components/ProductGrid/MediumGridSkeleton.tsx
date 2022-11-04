import type { LinksFunction } from '@remix-run/node';
import Skeleton from '@mui/material/Skeleton';

import styles from './styles/MediumGrid.css';

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
        <div className="medium-grid-image">
          <Skeleton variant='rectangular' height='284px' />
        </div>
      </div>

      <div className="product-desc-container">
        <div className="prod-info">
          {/* topic */}
          <div className="headline">
            <Skeleton variant='text' />
            <Skeleton variant='text' />
          </div>

          <p>
            <Skeleton variant='text' />
            <Skeleton variant='text' />
          </p>
        </div>

        <div className="view-btn-container">
          <Skeleton variant='rounded' height='30px' width='80px' />
        </div>
      </div>
    </div>
  );
}
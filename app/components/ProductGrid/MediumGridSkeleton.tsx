import type { LinksFunction } from '@remix-run/node';
import Skeleton from 'react-loading-skeleton'
import skeletonStyles from 'react-loading-skeleton/dist/skeleton.css'

import styles from './styles/MediumGrid.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
    { rel: 'stylesheet', href: skeletonStyles },
  ];
};

// The responsive mechanism should be the same as medium grid.
export default function MediumGridSkeleton() {
  return (
    <div className="medium-grid-container">
      <div className="image-container">
        <div className="medium-grid-image">
          <Skeleton height={'100%'} />
        </div>
      </div>

      <div className="product-desc-container">
        <div className="prod-info">
          {/* topic */}
          <div className="headline">
            <Skeleton
              count={2}
              width='100%'
            />
          </div>


          <p>
            <Skeleton />
          </p>
        </div>

        <div className="view-btn-container">
          <Skeleton height='30px' width='80px' />
        </div>
      </div>
    </div>
  );
}
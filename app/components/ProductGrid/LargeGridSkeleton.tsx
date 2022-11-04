import type { LinksFunction } from '@remix-run/node';
import Skeleton from 'react-loading-skeleton'
import skeletonStyles from 'react-loading-skeleton/dist/skeleton.css'

import styles from './styles/LargeGrid.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
    { rel: 'stylesheet', href: skeletonStyles },
  ];
};

export default function LargeGridSkeleton() {
  return (
    <div className='large-grid-container'>
      <div className="image-container">
        <div className="large-grid-image">
          <Skeleton height='100%' />
        </div>
      </div>

      <div className="product-desc-container">

        <div className="info">
          <div className="headline">
            <Skeleton width='80%' />
          </div>

          <div className="desc">
            <Skeleton width='80%' />
          </div>
        </div>

        <div className="btn-container">
          <Skeleton height='60px' />
        </div>
      </div>
    </div>
  );
};
import type { LinksFunction } from '@remix-run/node';
import Skeleton from '@mui/material/Skeleton';

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
        <div className="large-grid-image">
          <Skeleton variant='rectangular' height='100%' />
        </div>
      </div>

      <div className="product-desc-container">

        <div className="info">
          <div className="headline">
            <Skeleton variant='text' width='80%' />
          </div>

          <div className="desc">
            <Skeleton variant='text' width='80%' />
          </div>
        </div>

        <div className="btn-container">
          <Skeleton variant='text' height='60px' />
        </div>
      </div>
    </div>
  );
};
import Skeleton from '@mui/material/Skeleton';
import type { LinksFunction } from '@remix-run/node';

import styles from './styles/LoadingSkeleton.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export default function LoadingSkeleton() {
  return (
    <div className="ResultSkeleton-wrapper">
      <div className="ResulSkeleton-annotation-container">
        <div className="ResulSkeleton-annotation-success-icon">
          <Skeleton variant='circular' width={120} height={120} />
        </div>

        <div className="ResulSkeleton-annotation-title">
          <Skeleton variant='text' width={320} sx={{ fontSize: '1rem' }} />
          <Skeleton variant='text' width={320} sx={{ fontSize: '1rem' }} />
        </div>

        <div className="ResulSkeleton-annotation-continue-shopping-btn">
          <Skeleton variant='rectangular' width={85} height={30} />
          <Skeleton variant='rectangular' width={85} height={30} />
        </div>
      </div>

      <div className="ResultSkeleton-order-detail-container">
        <Skeleton variant='rectangular' height='100%' />
      </div>

      <div className="ResultSkeleton-summary-container">
        <div className="ResultSkeleton-product-row">
          <div className="ResultSkeleton-product-left">
            <Skeleton variant='text' width={250} />
            <Skeleton variant='text' width={150} />
          </div>

          <div className="ResultSkeleton-product-right">
            <Skeleton variant='text' width={50} sx={{ fontSize: '1rem' }} />
          </div>
        </div>

        <div className="ResultSkeleton-product-row">
          <div className="ResultSkeleton-product-left">
            <Skeleton variant='text' width={250} />
            <Skeleton variant='text' width={150} />
          </div>

          <div className="ResultSkeleton-product-right">
            <Skeleton variant='text' width={50} sx={{ fontSize: '1rem' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
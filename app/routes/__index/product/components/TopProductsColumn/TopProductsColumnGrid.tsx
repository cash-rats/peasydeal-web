import type { ReactNode } from 'react';
import { Link } from '@remix-run/react';
import Skeleton from '@mui/material/Skeleton';

import { composeProductDetailURL } from '~/utils';

interface TopProductsColumnGridProps {
  productUUID?: string;
  title?: ReactNode;
  image?: string;
  loading?: boolean;
}

export default function TopProductsColumnGrid({ productUUID = '', title = '', image = '', loading = false }: TopProductsColumnGridProps) {
  return (
    <div className="TopProductsColumn-grid">
      <div className="TopProductsColumn-grid-left">
        {
          loading
            ? (
              <Skeleton variant='rectangular' height='100%' />
            )
            : (
              <>
                <Link to={composeProductDetailURL({
                  productName: title as string,
                  variationUUID: productUUID
                })}>
                  <img
                    alt='recommend product'
                    src={image}
                  />
                </Link>
              </>

            )
        }
      </div>

      <div className="TopProductsColumn-grid-right">
        <p>
          {
            loading
              ? (
                <>
                  <Skeleton variant='text' height='20px' />
                  <Skeleton variant='text' height='20px' />
                </>
              )
              : title
          }
        </p>
      </div>
    </div>
  )
}
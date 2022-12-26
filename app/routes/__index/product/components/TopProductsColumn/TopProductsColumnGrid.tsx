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
    <div className="flex items-center mt-4 gap-3">
      <div className="w-[90px] h-[90px] rounded-md overflow-hidden">
        {
          loading
            ? (
              <Skeleton variant='rectangular' height='100%' width='100%' />
            )
            : (
              <>
                <Link to={composeProductDetailURL({
                  productName: title as string,
                  variationUUID: productUUID
                })}>
                  <img
                    className="w-[90px] h-[90px]"
                    alt='recommend product'
                    src={image}
                  />
                </Link>
              </>

            )
        }
      </div>

      <div className="w-[164px] py-0 px-[0.6rem] box-border">
        <p className="leading-[1.6rem] text-[13px] m-0 text-[cornflower-blue]">
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
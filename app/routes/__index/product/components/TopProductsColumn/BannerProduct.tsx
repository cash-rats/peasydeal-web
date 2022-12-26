import type { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import Skeleton from '@mui/material/Skeleton';

import { composeProductDetailURL } from '~/utils';
import RoundButton, { links as RoundButtonLinks } from '~/components/RoundButton';

export const links: LinksFunction = () => {
  return [
    ...RoundButtonLinks(),
  ];
};

interface BannerProductProps {
  productUUID?: string;
  title?: string;
  loading?: boolean;
  image?: string;
}

export default function BannerProduct({
  productUUID = '',
  title = '',
  loading = false,
  image,
}: BannerProductProps) {
  return (
    <>
      {
        loading
          ? (
            <div className="TopProductsColumn__banner">
              <Skeleton
                variant='rectangular'
                height='100%'
                width='100%'
              />
            </div>
          )
          : (
            <div style={{
              backgroundImage: `linear-gradient(to bottom, transparent 60%, black 120%), url(${image})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }} className="TopProductsColumn__banner">
              <p className="TopProductsColumn__banner-text">
                {title}
              </p>

              <Link to={composeProductDetailURL({ productName: title, variationUUID: productUUID })}>
                <RoundButton
                  style={{
                    width: '140px'
                  }}
                  colorScheme='cerise'
                >
                  View
                </RoundButton  >
              </Link>
            </div>
          )
      }
    </>
  )
}
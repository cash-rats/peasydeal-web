import { Link } from 'react-router';
import Skeleton from '@mui/material/Skeleton';

import { composeProductDetailURL } from '~/utils';
import RoundButton from '~/components/RoundButton';
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
            <div className="pb-5 w-full h-96 rounded-lg flex flex-col justify-end items-center">
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
            }} className="pb-5 w-full h-96 rounded-lg flex flex-col justify-end items-center">
              <p className="text-[white] text-center mb-[0.3rem]">
                {title}
              </p>

              <Link to={composeProductDetailURL({
                productName: title,
                productUUID,
              })}>
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

BannerProduct.displayName = 'BannerProduct';
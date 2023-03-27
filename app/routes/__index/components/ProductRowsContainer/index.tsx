import type { LinksFunction } from '@remix-run/node';
import type { ScrollPosition } from 'react-lazy-load-image-component';

import { Skeleton, SkeletonText } from '@chakra-ui/react'

import { links as OneMainTwoSubsLinks } from "~/components/ProductRow/OneMainTwoSubs";
import { links as EvenRowLinks } from '~/components/ProductRow/EvenRow';
import type { Product } from '~/shared/types';

import { RegularCardWithActionButton, links as ProductCartLinks } from '~/components/ProductCard';

export const links: LinksFunction = () => {
  return [
    ...OneMainTwoSubsLinks(),
    ...EvenRowLinks(),
    ...ProductCartLinks(),
  ];
};

const LoadingRows = ({ defaultSkeloton = 16 }) => {
  return (
    <div className='
      grid
      gap-2 md:gap-3 lg:gap-4
      grid-cols-2 md:grid-cols-3 lg:grid-cols-4
      mb-2 md:mb-3 lg:mb-4
    '>
      {
        (new Array(defaultSkeloton).fill(0)).map((_, index) => (
          <div className='flex border-lg' key={`skeloton_${index}`}>
            <Skeleton
              className='w-full'
              height={[183, 183, 253]}
            />
            <SkeletonText mt='4' noOfLines={3} spacing='4' skeletonHeight='2' />
          </div>
        ))
      }
    </div>
  );
}

interface ProductRowsContainerProps {
  onClickProduct?: (title: string, prodID: string) => void;

  products?: Product[];

  loading?: boolean;

  // Used to improve performance for react-lazy-load-image-component
  scrollPosition?: ScrollPosition;

  // Reacts shopnow button in activity banner.
  onClickShopNow?: (catID: number, catTitle: string) => void;

  defaultSkeloton?: number;
}

function ProductRowsContainer({
  onClickProduct = () => { },
  products = [],
  loading = false,
  scrollPosition,
  defaultSkeloton = 16,
}: ProductRowsContainerProps) {

  return (
    <div className='w-full'>
      {
        loading
          ? (<LoadingRows defaultSkeloton={defaultSkeloton} />)
          : (
            <div className='w-full max-w-screen-xl mx-auto'>
              <div className="
                    grid
                    gap-2 md:gap-3 lg:gap-4
                    grid-cols-2 md:grid-cols-3 lg:grid-cols-4
                    mb-2 md:mb-3 lg:mb-4
                  ">
                {
                  Object.keys(products).length !== 0 && products.map((product: Product, index) => {
                    return (
                      <RegularCardWithActionButton
                        key={`product-item-${index}-${product.productUUID}`}
                        product={product}
                        scrollPosition={scrollPosition}
                        onClickProduct={onClickProduct}
                      />
                    )
                  })
                }
              </div>
            </div>
          )
      }
    </div>
  );
}

export default ProductRowsContainer;

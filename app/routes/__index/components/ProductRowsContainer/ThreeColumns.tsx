import type { LinksFunction } from '@remix-run/node';
import type { ScrollPosition } from 'react-lazy-load-image-component';

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

function ThreeColumns({
  onClickProduct = () => { },
  products = [],
  loading = false,
  scrollPosition,
}: ProductRowsContainerProps) {

  return (
    <div className='w-full'>
      {
        <div className='w-full max-w-screen-xl mx-auto'>
          <div className="
            grid
            gap-3 md:gap-3 lg:gap-6
            grid-cols-2 lg:grid-cols-3
            mb-2 md:mb-3 lg:mb-4
          ">
            {
              Object.keys(products).length !== 0 && products.map((product: Product, index) => {
                return (
                  <RegularCardWithActionButton
                    key={`product-item-${index}-${product.productUUID}`}
                    loading={loading}
                    product={product}
                    scrollPosition={scrollPosition}
                    onClickProduct={onClickProduct}
                    displayActionButton={false}
                    noPadding={true}
                  />
                )
              })
            }
          </div>
        </div>
      }
    </div>
  );
}

export default ThreeColumns;

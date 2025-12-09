import type { LinksFunction } from 'react-router';
import { links as OneMainTwoSubsLinks } from "~/components/ProductRow/OneMainTwoSubs";
import { links as EvenRowLinks } from '~/components/ProductRow/EvenRow';
import type { Product } from '~/shared/types';

import { RegularCardWithActionButton} from '~/components/ProductCard';

export const links: LinksFunction = () => {
  return [
    ...OneMainTwoSubsLinks(),
    ...EvenRowLinks(),
  ];
};

interface ProductRowsContainerProps {
  onClickProduct?: (title: string, prodID: string) => void;

  products?: Product[];

  loading?: boolean;

  // Reacts shopnow button in activity banner.
  onClickShopNow?: (catID: number, catTitle: string) => void;

  defaultSkeloton?: number;
}

function ProductRowsContainer({
  onClickProduct = () => { },
  products = [],
  loading = false,
  defaultSkeloton,
}: ProductRowsContainerProps) {
  const shouldShowSkeleton = loading || (products.length === 0 && defaultSkeloton !== undefined);
  const skeletonCount = Math.max(defaultSkeloton ?? 8, 1);
  const items = shouldShowSkeleton ? Array.from({ length: skeletonCount }) : products;

  return (
    <div className='w-full'>
      {
        <div className='w-full max-w-screen-xl mx-auto'>
          <div className="
            grid
            gap-2 md:gap-3 lg:gap-4
            grid-cols-2 md:grid-cols-3 lg:grid-cols-4
            mb-2 md:mb-3 lg:mb-4
          ">
            {
              items.map((product: Product | undefined, index) => (
                <RegularCardWithActionButton
                  key={`product-item-${index}-${product?.productUUID ?? 'skeleton'}`}
                  loading={shouldShowSkeleton}
                  product={shouldShowSkeleton ? undefined : product}
                  onClickProduct={onClickProduct}
                  displayActionButton={false}
                />
              ))
            }
          </div>
        </div>
      }
    </div>
  );
}

export default ProductRowsContainer;

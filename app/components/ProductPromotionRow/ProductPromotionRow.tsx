/**
 * This component render the modulared products
 * into a product grid
 */
import type { Product } from "~/shared/types";

import { RegularCardWithActionButton } from '../ProductCard';

interface IProductPromotionRow {
  products?: Product[];
  onClickProduct?: (title: string, productID: string) => void;
  loading?: boolean;
  defaultSkeleton?: number;
}

export default function ProductPromotionRow({
  products = [],
  loading = false,
  defaultSkeleton = 4,
  onClickProduct = () => { },
}: IProductPromotionRow) {
  const shouldShowSkeleton = loading || products.length === 0;
  const skeletonCount = Math.max(defaultSkeleton, 1);
  const items = shouldShowSkeleton ? Array.from({ length: skeletonCount }) : products;

  return (
    <div className='
      grid
      gap-2 md:gap-3 lg:gap-4
      grid-cols-2 md:grid-cols-3 lg:grid-cols-4
      mb-2 md:mb-3 lg:mb-4
    '>
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
  );
};

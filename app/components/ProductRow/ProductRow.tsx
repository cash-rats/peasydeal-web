/**
 * This component render the modulared products
 * into a product grid
 */
import type { ScrollPosition } from 'react-lazy-load-image-component';
import type { Product } from "~/shared/types";
import ProductCard from '../ProductCard';

interface IProductRow {
  products?: Product[];
  scrollPosition?: ScrollPosition;
  onClickProduct?: (title: string, productID: string) => void;
}

export default function ProductRow({
	products = [],
	onClickProduct = () => {},
  scrollPosition,
}: IProductRow) {
  return (
    <div className='
      grid
      gap-2 md:gap-3 lg:gap-4
      grid-cols-2 md:grid-cols-3 lg:grid-cols-4
      mb-2 md:mb-3 lg:mb-4
    '>
      {
        products.map((product: Product, index) => (
          <ProductCard
            key={`product-item-${index}-${product.productUUID}`}
            product={product}
            scrollPosition={scrollPosition}
            onClickProduct={onClickProduct}
          />
        ))
      }
    </div>
  );
};


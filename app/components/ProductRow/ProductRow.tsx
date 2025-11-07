/**
 * This component render the modulared products
 * into a product grid
 */
import type { LinksFunction } from '@remix-run/node';
import type { Product } from "~/shared/types";

import { RegularCardWithActionButton, links as ProductCartLinks } from '../ProductCard';

export const links: LinksFunction = () => {
  return [...ProductCartLinks()];
}

interface IProductRow {
  products?: Product[];
  onClickProduct?: (title: string, productID: string) => void;
}

export default function ProductRow({
  products = [],
  onClickProduct = () => { },
}: IProductRow) {
  return (
    <div className='
      grid
      gap-2 md:gap-3 lg:gap-4
      grid-cols-2 md:grid-cols-3 lg:grid-cols-4
      mb-2 md:mb-3 lg:mb-4
    '>
      {
        products.map((product: Product, index: number) => (
          <RegularCardWithActionButton
            key={`product-item-${index}-${product.productUUID}`}
            product={product}
            onClickProduct={onClickProduct}
            displayActionButton={false}
          />
        ))
      }
    </div>
  );
};


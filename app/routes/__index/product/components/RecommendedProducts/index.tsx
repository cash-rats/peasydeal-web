import ProductRowsLayout, { links as ProductRowsLayoutLinks } from '~/components/ProductRowsLayout';
import type { LinksFunction } from '@remix-run/node';

import type { Product } from '~/shared/types';
import { organizeTo9ProdsPerRow } from '~/utils/products';

import styles from './styles/RecommendedProducts.css';

export const links: LinksFunction = () => {
  return [
    ...ProductRowsLayoutLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

interface RecommendedProductsProps {
  products: Product[]
}

function RecommendedProducts({ products }: RecommendedProductsProps) {
  let rows: Product[][] = [];

  // Transform before using it.
  if (products.length > 0) {
    rows = organizeTo9ProdsPerRow(products);
  }

  return (
    <div className="recommended-products-wrapper">
      <h2 className="recommended-products-wrapper_title">
        you may also like
      </h2>

      <ProductRowsLayout productRows={rows} />
    </div>
  );
}

export default RecommendedProducts;
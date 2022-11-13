import { useEffect, useState } from 'react';
import type { LinksFunction, ActionFunction } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { json } from '@remix-run/node';

import type { Product } from '~/shared/types';

// Note: we don't need to import "style links" for this component
// because route `__index/index` already loaded it. If we load it
// again react would echo a error saying duplicate css being loaded
import ProductRowsLayout, { links as ProductRowsLayoutLinks } from '~/components/ProductRowsLayout';
import { organizeTo9ProdsPerRow } from '~/utils/products';
import { fetchCategories, normalizeToMap } from '~/categories.server';
import { fetchProductsByCategory } from '~/api';
import { PAGE_LIMIT } from '~/shared/constants';

import styles from './styles/RecommendedProducts.css';

export const links: LinksFunction = () => {
  return [
    ...ProductRowsLayoutLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

type ActionDataType = {
  products: Product[];
}

// generateRandomInteger random page number to recommand
function generateRandomInteger(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min) + 1);
}

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const category = body.get('category') as string || '';

  const categories = normalizeToMap(await fetchCategories());
  const targetCat = categories[category];

  if (!targetCat) {
    return json<ActionDataType>({ products: [] });
  }

  const randomPage = generateRandomInteger(1, 5);

  const products = await fetchProductsByCategory({
    category: targetCat.catId,
    page: randomPage,
    perpage: PAGE_LIMIT,
  });

  return json<ActionDataType>({ products });
}


interface RecommendedProductsProps {
  category: string;
  onClickProduct: (productID: string) => void;
}

function RecommendedProducts({ category, onClickProduct }: RecommendedProductsProps) {
  const fetcher = useFetcher();
  const [rows, setRows] = useState<Product[][]>([]);

  // console.log('debug fetcher', fetcher.type !== '');

  useEffect(() => {
    fetcher.submit({
      category
    }, { method: 'post', action: '/product/components/RecommendedProducts?index' });
  }, []);

  useEffect(() => {
    if (fetcher.type === 'done') {
      const { products } = fetcher.data;

      // Transform before using it.
      if (products.length > 0) {

        const rows = organizeTo9ProdsPerRow(products);
        setRows(rows)
      }
    }
  }, [fetcher])

  return (
    <div className="recommended-products-wrapper">
      <h2 className="recommended-products-wrapper_title">
        you may also like
      </h2>

      {
        <ProductRowsLayout
          loading={fetcher.type !== 'done'}
          onClickProduct={onClickProduct}
          productRows={rows}
        />
      }
    </div>
  );
}

export default RecommendedProducts;
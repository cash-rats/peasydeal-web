import { useEffect, useState } from 'react';
import type { LinksFunction, ActionFunction } from '@remix-run/node';
import { useFetcher, useTransition } from '@remix-run/react';
import { json } from '@remix-run/node';

import type { Product } from '~/shared/types';

// Note: we don't need to import "style links" for this component
// because route `__index/index` already loaded it. If we load it
// again react would echo a error saying duplicate css being loaded
import ProductRowsLayout, { links as ProductRowsLayoutLinks } from '~/components/ProductRowsLayout';
import { organizeTo9ProdsPerRow } from '~/utils/products';
import { fetchCategories, normalizeToMap } from '~/api/categories.server';
import { fetchProductsByCategoryV2 } from '~/api';
import { PAGE_LIMIT } from '~/shared/constants';


export const links: LinksFunction = () => {
  return [
    ...ProductRowsLayoutLinks(),
  ];
};

type ActionDataType = {
  products: Product[];
}

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const category = body.get('category') as string || '';

  const categories = normalizeToMap(await fetchCategories());
  const targetCat = categories[category];

  if (!targetCat) {
    return json<ActionDataType>({ products: [] });
  }


  const products = await fetchProductsByCategoryV2({
    category: Number(targetCat.catId),
    random: true,
    perpage: PAGE_LIMIT,
  });

  return json<ActionDataType>({ products });
}


interface RecommendedProductsProps {
  category: string;
  onClickProduct: (title: string, productID: string) => void;
}

function RecommendedProducts({ category, onClickProduct }: RecommendedProductsProps) {
  const fetcher = useFetcher();

  const [rows, setRows] = useState<Product[][]>([]);
  const transition = useTransition();

  useEffect(() => {
    if (transition.state !== 'idle') {
      fetcher.submit({
        category
      }, { method: 'post', action: '/product/components/RecommendedProducts?index' });
    }
  }, [transition.state])

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
    <div className="mt-6">
      <h1 className="uppercase font-bold text-3xl mb-6">
        you may also like
      </h1>

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
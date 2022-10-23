import { useEffect, useState } from 'react';
import type { LinksFunction, ActionFunction } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { json } from '@remix-run/node';

import type { Product } from '~/shared/types';
import ProductRowsLayout, { links as ProductRowsLayoutLinks } from '~/components/ProductRowsLayout';
import { organizeTo9ProdsPerRow } from '~/utils/products';

import styles from './styles/RecommendedProducts.css';
import { fetchProductsByCategory } from '~/api';
import { AiOutlineConsoleSql } from 'react-icons/ai';

export const links: LinksFunction = () => {
  return [
    ...ProductRowsLayoutLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

type ActionDataType = {
  products: Product[];
}

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const category = body.get('category') as string || '';
  const products = await fetchProductsByCategory({ category });
  return json<ActionDataType>({ products });
}

interface RecommendedProductsProps {
  category: string;
  onClickProduct: (productID: string) => void;
}

function RecommendedProducts({ category, onClickProduct }: RecommendedProductsProps) {
  const fetcher = useFetcher();
  const [rows, setRows] = useState<Product[][]>([]);

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

      <ProductRowsLayout onClickProduct={onClickProduct} productRows={rows} />
    </div>
  );
}

export default RecommendedProducts;
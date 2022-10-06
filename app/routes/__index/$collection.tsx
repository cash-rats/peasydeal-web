import { useState } from 'react';
import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { PAGE_LIMIT } from '~/shared/constants';
import { Product } from '~/shared/types';

import styles from './styles/ProductList.css';
import { fetchProductsByCategory } from "./api";
import { transformData, organizeTo9ProdsPerRow } from './utils';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url);
  const perPage = Number(url.searchParams.get('per_page') || PAGE_LIMIT);
  const page = Number(url.searchParams.get('page') || '1');
  const { collection } = params;

  const resp = await fetchProductsByCategory({
    perpage: perPage,
    page,
    category: collection,
  })

  const respJSON = await resp.json();
  // Transform data to frontend compatible format.
  const transformedProds = transformData(respJSON.products)
  const prodRows = organizeTo9ProdsPerRow(transformedProds)

  return json({ prod_rows: prodRows });
}

function Collection() {
  const preloadProds = useLoaderData();
  const [productRows, addProductRows] = useState<Product[][]>(preloadProds.prod_rows);

  console.log('debug', productRows);

  return (
    <div>
      some collection
    </div>
  );
}

export default Collection;
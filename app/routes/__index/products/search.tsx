import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { searchProducts } from './api';

type LoaderData = {
  products: any;
  query: string | null;
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get('query');

  if (!query) {
    return json<LoaderData>({ products: [], query });
  }

  const products = await searchProducts({ query });

  return json<LoaderData>({ products, query });
};

export default function Search() {
  const { products, query } = useLoaderData<LoaderData>();

  console.log('debug 1', products, query);

  return (
    <div>
      search
    </div>
  );
}
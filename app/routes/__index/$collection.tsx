import { useState, useEffect, useRef } from "react";
import type { LinksFunction, LoaderFunction, ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useFetcher, useLoaderData, PrefetchPageLinks, useSubmit } from '@remix-run/react';
import { NavLink } from '@remix-run/react';

import Spinner from "~/components/Spinner";
import { PAGE_LIMIT } from '~/shared/constants';
import type { Product } from '~/shared/types';
import LoadMore, { links as LoadmoreLinks } from "~/components/LoadMore";
import Breadcrumbs, { links as BreadCrumbsLinks } from '~/components/Breadcrumbs';

import styles from './styles/ProductList.css';
import { fetchProductsByCategory } from "./api";
import { transformData, organizeTo9ProdsPerRow } from './utils';
import ProductRowsContainer, { links as ProductRowsContainerLinks } from './components/ProductRowsContainer';

export const links: LinksFunction = () => {
  return [
    ...ProductRowsContainerLinks(),
    ...LoadmoreLinks(),
    ...BreadCrumbsLinks(),
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

  // Transform data to frontend compatible format.
  const prodRows = organizeTo9ProdsPerRow(resp)

  return json({ prod_rows: prodRows, category: collection });
}

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const productID = body.get("product_id");

  return redirect(`/product/${productID}`);
};

function Collection() {
  const { prod_rows: preloadProds, category } = useLoaderData();
  const [productRows, addProductRows] = useState<Product[][]>(preloadProds);
  const currPage = useRef(1);
  const loadmoreFetcher = useFetcher();
  const submit = useSubmit();

  useEffect(() => {
    if (loadmoreFetcher.type === 'done') {
      // Current page fetched successfully, increase page number getting ready to fetch next page.
      const productRows = loadmoreFetcher.data.prod_rows;
      addProductRows(prev => prev.concat(productRows))
    }
  }, [loadmoreFetcher])


  const handleLoadMore = () => {
    currPage.current += 1;
    loadmoreFetcher.load(`/${category}?page=${currPage.current}&per_page=${PAGE_LIMIT}`);
  };

  const handleClickProduct = (prodID: string) => {
    submit({ product_id: prodID }, { method: 'post' });
  };

  return (
    <div className="prod-collection-container">
      <PrefetchPageLinks page='/product/$productId' />

      <div className="prod-list-breadcrumbs-container">
        <Breadcrumbs breadcrumbs={[
          <NavLink
            className={({ isActive }) => (
              isActive
                ? "breadcrumbs-link breadcrumbs-link-active"
                : "breadcrumbs-link"
            )}
            key='1'
            to={`/${category}`}
          >
            {category}
          </NavLink>,
        ]} />
      </div>

      <ProductRowsContainer
        productRows={productRows}
        onClickProduct={handleClickProduct}
      />

      <loadmoreFetcher.Form>
        <input
          type="hidden"
          name="page"
          value={currPage.current}
        />

        <LoadMore
          spinner={Spinner}
          loading={loadmoreFetcher.state !== 'idle'}
          callback={handleLoadMore}
          delay={100}
          offset={150}
        />
      </loadmoreFetcher.Form>
    </div>
  );
}

export default Collection;
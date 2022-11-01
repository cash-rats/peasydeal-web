import { useState, useEffect, useRef } from "react";
import type { LinksFunction, LoaderFunction, ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useFetcher, useLoaderData, useSubmit } from '@remix-run/react';
import { NavLink } from '@remix-run/react';
import httpStatus from 'http-status-codes';

import CssSpinner, { links as CssSpinnerLinks } from '~/components/CssSpinner';
import { PAGE_LIMIT } from '~/shared/constants';
import type { Product } from '~/shared/types';
import LoadMore, { links as LoadmoreLinks } from "~/components/LoadMore";
import Breadcrumbs, { links as BreadCrumbsLinks } from '~/components/Breadcrumbs';
import LoadMoreButton, { links as LoadMoreButtonLinks } from '~/components/LoadMoreButton';
import { normalizeToMap, fetchCategories } from '~/categories.server';

import styles from './styles/ProductList.css';
import { fetchProductsByCategory } from "./api";
import { organizeTo9ProdsPerRow } from './utils';
import ProductRowsContainer, { links as ProductRowsContainerLinks } from './components/ProductRowsContainer';

type LoaderType = {
  prod_rows: Product[][],
  has_more: boolean,
  category: string,
};

export const links: LinksFunction = () => {
  return [
    ...CssSpinnerLinks(),
    ...ProductRowsContainerLinks(),
    ...LoadmoreLinks(),
    ...BreadCrumbsLinks(),
    ...LoadMoreButtonLinks(),
    { rel: 'stylesheet', href: styles },
  ];
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url);
  const perPage = Number(url.searchParams.get('per_page') || PAGE_LIMIT);
  const page = Number(url.searchParams.get('page') || '1');
  const { collection = '' } = params;

  const catMap = normalizeToMap(await fetchCategories());
  const targetCat = catMap[collection];
  if (!targetCat) {
    throw json(`target category ${collection} not found`, httpStatus.NOT_FOUND);
  }

  const prods = await fetchProductsByCategory({
    perpage: perPage,
    page,
    category: catMap[collection].catId,
  })

  let prodRows: Product[][] = [];

  if (prods.length > 0) {
    prodRows = organizeTo9ProdsPerRow(prods);
  }

  return json<LoaderType>({
    prod_rows: prodRows,
    has_more: prods.length === PAGE_LIMIT,
    category: collection,
  });
}

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const productID = body.get("product_id");

  return redirect(`/product/${productID}`);
};

export const CatchBoundary = () => {
  return (
    <div>
      category not found.
    </div>
  );
};

function Collection() {
  const { prod_rows: preloadProds, category, has_more } = useLoaderData<LoaderType>();
  const [productRows, setProductRows] = useState<Product[][]>(preloadProds);
  const [hasMore, setHasMore] = useState(has_more);
  const currPage = useRef(1);
  const loadmoreFetcher = useFetcher();
  const submit = useSubmit();

  useEffect(() => {
    setProductRows(preloadProds);
  }, [preloadProds])

  useEffect(() => {
    if (loadmoreFetcher.type === 'done') {
      // Current page fetched successfully, increase page number getting ready to fetch next page.
      const productRows = loadmoreFetcher.data.prod_rows;

      if (productRows.length > 0) {
        currPage.current += 1;
      }

      if (productRows.length <= 0) {
        setHasMore(false);

        return;
      }

      setProductRows(prev => prev.concat(productRows))
    }
  }, [loadmoreFetcher])


  const handleLoadMore = () => {
    const nextPage = currPage.current + 1;
    loadmoreFetcher.load(`/${category}?page=${nextPage}&per_page=${PAGE_LIMIT}`);
  };

  const handleManualLoad = () => {
    loadmoreFetcher.load(`/?index&page=${currPage.current}&per_page=${PAGE_LIMIT}`);
  }

  const handleClickProduct = (prodID: string) => {
    submit({ product_id: prodID }, { method: 'post' });
  };

  return (
    <div className="prod-collection-container">
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

        <div className="ProductList__loadmore-container">
          {
            hasMore
              ? (

                <LoadMore
                  spinner={<CssSpinner scheme='spinner' />}
                  loading={loadmoreFetcher.state !== 'idle'}
                  callback={handleLoadMore}
                  delay={100}
                  offset={150}
                />
              )
              : <LoadMoreButton
                loading={loadmoreFetcher.state !== 'idle'}
                onClick={handleManualLoad}
                text='Load more'
              />
          }
        </div>
      </loadmoreFetcher.Form>
    </div>
  );
}

export default Collection;
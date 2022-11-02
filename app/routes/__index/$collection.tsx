import { useState, useEffect, useRef, useContext } from "react";
import type { LinksFunction, LoaderFunction, ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  useFetcher,
  useLoaderData,
  NavLink,
  useSearchParams,
} from '@remix-run/react';
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
import { ProductsContext, addCollectionProducts, setCollectionProducts } from '../reducers/products_reducer';

type LoaderType = {
  category: string,
};

type ActionType = {
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

type __ActionType = 'redirect_to_prod' | 'load_category_products';

export const loader: LoaderFunction = async ({ params, request }) => {
  // const url = new URL(request.url);
  // const perPage = Number(url.searchParams.get('per_page') || PAGE_LIMIT);
  // const page = Number(url.searchParams.get('page') || '1');
  const { collection = '' } = params;

  // const catMap = normalizeToMap(await fetchCategories());
  // const targetCat = catMap[collection];
  // if (!targetCat) {
  //   throw json(`target category ${collection} not found`, httpStatus.NOT_FOUND);
  // }

  // const prods = await fetchProductsByCategory({
  //   perpage: perPage,
  //   page,
  //   category: catMap[collection].catId,
  // })

  // let prodRows: Product[][] = [];

  // if (prods.length > 0) {
  //   prodRows = organizeTo9ProdsPerRow(prods);
  // }

  return json<LoaderType>({
    category: collection,
  });
  // return null;
}

const __loadCategoryProducts = async (category: string, page: number, perPage: number) => {
  const catMap = normalizeToMap(await fetchCategories());
  const targetCat = catMap[category];
  if (!targetCat) {
    throw json(`target category ${category} not found`, httpStatus.NOT_FOUND);
  }

  console.log('debug __loadCategoryProducts', page);

  const prods = await fetchProductsByCategory({
    perpage: perPage,
    page,
    category: catMap[category].catId,
  })

  let prodRows: Product[][] = [];

  if (prods.length > 0) {
    prodRows = organizeTo9ProdsPerRow(prods);
  }

  return json<ActionType>({
    prod_rows: prodRows,
    has_more: prods.length === PAGE_LIMIT,
    category,
  });
}

export const action: ActionFunction = async ({ request, params }) => {
  const body = await request.formData();
  const actionType = body.get("__action") as __ActionType;

  if (actionType === 'load_category_products') {
    const page = Number(body.get("page") || '1');
    const perPage = Number(body.get("per_page")) || PAGE_LIMIT;
    const { collection = '' } = params;

    return __loadCategoryProducts(collection, page, perPage);
  }


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
  const { category } = useLoaderData<LoaderType>();
  const [hasMore, setHasMore] = useState(true);
  const currPage = useRef(1);

  const fetcher = useFetcher();
  const loadmoreFetcher = useFetcher();

  const [state, dispatch] = useContext(ProductsContext);


  useEffect(() => {
    if (fetcher.type === 'done') {
      // Current page fetched successfully, increase page number getting ready to fetch next page.
      const { prod_rows: productRows } = fetcher.data as ActionType;
      console.log('debug productRows', productRows);
      if (productRows.length <= 0) {
        setHasMore(false);

        return;
      }

      dispatch(setCollectionProducts(productRows));
    }
  }, [fetcher])

  useEffect(() => {
    if (loadmoreFetcher.type === 'done') {
      const { prod_rows: productRows } = loadmoreFetcher.data as ActionType;

      if (productRows.length <= 0) {
        setHasMore(false);

        return;
      }

      currPage.current += 1;
      dispatch(addCollectionProducts(productRows));
    }
  }, [loadmoreFetcher])


  // User changes category, always load the 1st page.
  useEffect(() => {
    currPage.current = 1;

    fetcher.submit(
      {
        __action: 'load_category_products',
        page: currPage.current.toString(),
        per_page: PAGE_LIMIT.toString(),
      },
      {
        method: 'post',
        action: `/${category}`
      },
    );
  }, [category]);

  const handleLoadMore = () => {
    const nextPage = currPage.current + 1;
    loadmoreFetcher.submit(
      {
        __action: 'load_category_products',
        page: nextPage.toString(),
        per_page: PAGE_LIMIT.toString(),
      },
      {
        method: 'post',
        action: `/${category}`
      },
    );
  };

  const handleManualLoad = () => {
    const nextPage = currPage.current + 1;
    loadmoreFetcher.submit(
      {
        __action: 'load_category_products',
        page: nextPage.toString(),
        per_page: PAGE_LIMIT.toString(),
      },
      {
        method: 'post',
        action: `/${category}`
      },
    );
  }

  return (
    <div className="prod-list-container">
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

      <ProductRowsContainer productRows={state.collection_products} />

      <fetcher.Form>
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
      </fetcher.Form>
    </div>
  );
}

export default Collection;
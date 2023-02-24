import { useEffect, useRef, useReducer } from 'react';
import type { LinksFunction, LoaderFunction, ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import httpStatus from 'http-status-codes';
import { trackWindowScroll } from "react-lazy-load-image-component";
import type { LazyComponentProps } from "react-lazy-load-image-component";
import { useCatch, useLoaderData, useFetcher } from '@remix-run/react';

import { PAGE_LIMIT } from '~/shared/constants';
import type { Product } from '~/shared/types';
import LoadMoreButtonProgressBar from '~/components/LoadMoreButtonProgressBar';
import PageTitle from '~/components/PageTitle';

import reducer, { SearchActionType } from './reducer';
import ProductRowsContainer, { links as ProductRowsContainerLinks } from '../components/ProductRowsContainer';
import { searchProducts } from '../api';
import searchStyles from '../styles/Search.css';

export const links: LinksFunction = () => {
  return [
    ...ProductRowsContainerLinks(),
    { rel: 'stylesheet', href: searchStyles },
  ];
};

type LoaderType = {
  products: Product[];
  query: string;
  page: number;
  total: number;
  current: number;
  has_more: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("query");
  const page = Number(url.searchParams.get('page')) || 1;

  if (!search) {
    throw json('no query provided', httpStatus.BAD_REQUEST);
  }

  const { products, total, current, has_more } = await searchProducts({
    query: search,
    perpage: PAGE_LIMIT,
    page,
  })

  if (products.length === 0) {
    throw json({ query: search }, httpStatus.NOT_FOUND);
  }

  return json<LoaderType>({
    products,
    query: search,
    page,
    total,
    current,
    has_more,
  });
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const formObj = Object.fromEntries(form.entries());
  return redirect(`/search?index&query=${formObj['query']}`);
}

// TODO: more design
export const CatchBoundary = () => {
  const caught = useCatch();
  if (caught.status === httpStatus.NOT_FOUND) {
    return (
      <div className="Search__notfound-warpper">
        <div className="Search__notfound-content">
          <p className="Search__notfound-text">
            No product found for: {caught.data.query}
          </p>

          <p className="Search__notfound-text">
            Please try search again, check your key word or try another word.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div />
  )
}

type TSearch = {} & LazyComponentProps;

// TODOs:
//   - Need to add breadcrumbs navigation bar.
//   - No result page.
function Search({ scrollPosition }: TSearch) {
  const loaderData = useLoaderData<LoaderType>();
  const [state, dispatch] = useReducer(reducer, {
    products: loaderData.products,
    query: loaderData.query,
    page: 1,
    total: loaderData.total,
    current: loaderData.current,
  });

  const currPageRef = useRef(state.page);
  const loadMoreFetcher = useFetcher();

  // Update product rows when user searches different item. When user stays on `/search` page and searches again,
  // the component does not get rerendered (since we stay on the same page). Thus, we need to update product_rows
  // state when we get new search results from loader.
  useEffect(() => {
    dispatch({
      type: SearchActionType.set_products,
      payload: {
        products: loaderData.products,
        query: loaderData.query,
        page: 1,
        total: loaderData.total,
        current: loaderData.current,
      },
    });
  }, [loaderData.query]);

  useEffect(() => {
    if (loadMoreFetcher.type === 'done') {
      const { products, current } = loadMoreFetcher.data as LoaderType;

      if (products.length === 0) return;

      const newPage = currPageRef.current + 1;

      dispatch({
        type: SearchActionType.append_products,
        payload: {
          products,
          page: newPage,
          current,
        },
      })

      currPageRef.current = newPage;
    }
  }, [loadMoreFetcher]);

  const handleClickProduct = () => {
    console.log('handleClickProduct');
  };

  const handleLoadMore = () => {
    const nextPage = currPageRef.current + 1;

    loadMoreFetcher.submit(
      {
        query: loaderData.query,
        page: nextPage.toString()
      },
      { action: '/search?index' },
    );
  };

  return (
    <div className="my-0 mx-auto w-full flex flex-col justify-center flex-wrap items-center">
      <PageTitle
        title={`Search results for "${loaderData.query}" (${state.total})`}
      />

      <div className="pt-8">
        <ProductRowsContainer
          products={state.products}
          onClickProduct={handleClickProduct}
          scrollPosition={scrollPosition}
        />
      </div>

      <LoadMoreButtonProgressBar
        loading={loadMoreFetcher.state !== 'idle'}
        current={state.current}
        total={state.total}
        onClickLoadMore={handleLoadMore}
      />
    </div>
  )
}
export default trackWindowScroll(Search);
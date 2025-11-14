import { useEffect, useRef, useReducer } from 'react';
import type { LinksFunction, LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';
import { redirect } from 'react-router';
import httpStatus from 'http-status-codes';
import { useCatch, useLoaderData, useFetcher } from 'react-router';

import { PAGE_LIMIT } from '~/shared/constants';
import LoadMoreButtonProgressBar from '~/components/LoadMoreButtonProgressBar';
import PageTitle from '~/components/PageTitle';

import type { SearchProductsDataType } from './types';
import reducer, { SearchActionType } from './reducer';
import ProductRowsContainer, { links as ProductRowsContainerLinks } from '../components/ProductRowsContainer';
import searchStyles from '../styles/Search.css?url';
import {
  searchProductsLoader,
  searchMoreProductsLoader,
} from './loaders';

export const links: LinksFunction = () => {
  return [
    ...ProductRowsContainerLinks(),
    { rel: 'stylesheet', href: searchStyles },
  ];
};

type LoaderType =
  | 'search'
  | 'search_more';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const actionType = url.searchParams.get('action_type') || 'search' as LoaderType;
  const query = url.searchParams.get("query");
  const page = Number(url.searchParams.get('page')) || 1;

  if (!query) {
    return redirect('/');
  }

  if (actionType === 'search_more') {
    return searchMoreProductsLoader({
      query,
      perPage: PAGE_LIMIT,
      page
    })
  }

  return searchProductsLoader({
    query,
    perPage: PAGE_LIMIT,
    page,
  })
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const formObj = Object.fromEntries(form.entries());
  return redirect(
    !formObj['query']
      ? '/'
      : `/search?query=${formObj['query']}`
  );
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

type TSearch = {};

// TODOs:
//   - Need to add breadcrumbs navigation bar.
//   - No result page.
function Search() {
  const loaderData = useLoaderData<SearchProductsDataType>() || {};
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
        page: currPageRef.current,
        total: loaderData.total,
        current: loaderData.current,
      },
    });
  }, [loaderData.query]);

  useEffect(() => {
    if (loadMoreFetcher.type === 'done') {
      const { products, current } = loadMoreFetcher.data as SearchProductsDataType;

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
        action_type: 'search_more',
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
        />
      </div>

      <div className='mb-4'>
        <LoadMoreButtonProgressBar
          loading={loadMoreFetcher.state !== 'idle'}
          current={state.current}
          total={state.total}
          onClickLoadMore={handleLoadMore}
        />
      </div>
    </div>
  )
}
export default Search;
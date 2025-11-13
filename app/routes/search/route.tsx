import { useEffect, useReducer, useRef } from 'react';
import type { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs } from 'react-router';
import {
  isRouteErrorResponse,
  redirect,
  useFetcher,
  useLoaderData,
  useRouteLoaderData,
  useRouteError,
} from 'react-router';
import httpStatus from 'http-status-codes';

import { PAGE_LIMIT } from '~/shared/constants';
import LoadMoreButtonProgressBar from '~/components/LoadMoreButtonProgressBar';
import PageTitle from '~/components/PageTitle';
import ProductRowsContainer, { links as ProductRowsContainerLinks } from '~/components/ProductRowsContainer';
import CatalogLayout, { links as CatalogLayoutLinks } from '~/components/layouts/CatalogLayout';
import reducer, { SearchActionType } from './reducer';
import searchStyles from './styles/Search.css?url';
import { searchMoreProductsLoader, searchProductsLoader } from './loaders';
import type { SearchProductsDataType } from './types';
import type { Category } from '~/shared/types';
import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';

type LoaderData = SearchProductsDataType & {
  categories: Category[];
  navBarCategories: Category[];
};

export const links: LinksFunction = () => [
  ...CatalogLayoutLinks(),
  ...ProductRowsContainerLinks(),
  { rel: 'stylesheet', href: searchStyles },
];

type LoaderType = 'search' | 'search_more';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const actionType = (url.searchParams.get('action_type') ?? 'search') as LoaderType;
  const query = url.searchParams.get('query');
  const page = Number(url.searchParams.get('page')) || 1;

  if (!query) {
    return redirect('/');
  }

  if (actionType === 'search_more') {
    return searchMoreProductsLoader({
      query,
      perPage: PAGE_LIMIT,
      page,
    });
  }

  const [[navBarCategories, categories], searchData] = await Promise.all([
    fetchCategoriesWithSplitAndHotDealInPlaced(),
    searchProductsLoader({
      query,
      perPage: PAGE_LIMIT,
      page,
    }),
  ]);

  return {
    ...searchData,
    categories,
    navBarCategories,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const formObj = Object.fromEntries(form.entries());
  return redirect(!formObj['query'] ? '/' : `/search?query=${formObj['query']}`);
};

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === httpStatus.NOT_FOUND) {
    const data = (error.data ?? {}) as { query?: string };
    return (
      <div className="Search__notfound-warpper">
        <div className="Search__notfound-content">
          <p className="Search__notfound-text">No product found for: {data.query}</p>
          <p className="Search__notfound-text">
            Please try search again, check your key word or try another word.
          </p>
        </div>
      </div>
    );
  }

  return <div />;
}

function Search() {
  const loaderData = useLoaderData<LoaderData>();
  const rootData = useRouteLoaderData('root') as { cartCount?: number } | undefined;
  const cartCount = rootData?.cartCount ?? 0;
  const [state, dispatch] = useReducer(reducer, {
    products: loaderData.products,
    query: loaderData.query,
    page: 1,
    total: loaderData.total,
    current: loaderData.current,
  });

  const currPageRef = useRef(state.page);
  const loadMoreFetcher = useFetcher();

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
    if (loadMoreFetcher.state !== 'idle') return;
    const fetcherData = loadMoreFetcher.data as SearchProductsDataType | undefined;
    if (!fetcherData || fetcherData.products.length === 0) return;

    const newPage = currPageRef.current + 1;

    dispatch({
      type: SearchActionType.append_products,
      payload: {
        products: fetcherData.products,
        page: newPage,
        current: fetcherData.current,
      },
    });

    currPageRef.current = newPage;
  }, [loadMoreFetcher.state, loadMoreFetcher.data]);

  const handleClickProduct = () => {
    console.log('handleClickProduct');
  };

  const handleLoadMore = () => {
    const nextPage = currPageRef.current + 1;
    loadMoreFetcher.submit(
      {
        action_type: 'search_more',
        query: loaderData.query,
        page: nextPage.toString(),
      },
      { action: '/search?index' },
    );
  };

  return (
    <CatalogLayout
      categories={loaderData.categories}
      navBarCategories={loaderData.navBarCategories}
      cartCount={cartCount}
    >
      <div className="my-0 mx-auto w-full flex flex-col justify-center flex-wrap items-center">
        <PageTitle title={`Search results for "${loaderData.query}" (${state.total})`} />

        <div className="pt-8">
          <ProductRowsContainer products={state.products} onClickProduct={handleClickProduct} />
        </div>

        <div className="mb-4">
          <LoadMoreButtonProgressBar
            loading={loadMoreFetcher.state !== 'idle'}
            current={state.current}
            total={state.total}
            onClickLoadMore={handleLoadMore}
          />
        </div>
      </div>
    </CatalogLayout>
  );
}

export default Search;

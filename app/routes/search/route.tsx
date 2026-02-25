import { useEffect, useReducer, useRef } from 'react';
import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
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
import { V2Layout } from '~/components/v2/GlobalLayout';
import {
  ProductGrid,
  SortBar,
  ProgressIndicator,
  EmptyCollection,
} from '~/components/v2/CollectionPage';
import { LoadMoreButton } from '~/components/v2/LoadMore/LoadMore';
import { Breadcrumbs } from '~/components/v2/Breadcrumbs';

import reducer, { SearchActionType } from './reducer';
import { searchMoreProductsLoader, searchProductsLoader } from './loaders';
import type { SearchProductsDataType } from './types';
import type { RootLoaderData } from '~/root';

type LoaderData = SearchProductsDataType;

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

  return searchProductsLoader({
    query,
    perPage: PAGE_LIMIT,
    page,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const formObj = Object.fromEntries(form.entries());
  return redirect(!formObj['query'] ? '/' : `/search?query=${formObj['query']}`);
};

export function ErrorBoundary() {
  const error = useRouteError();
  const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
  const categories = rootData?.categories ?? [];
  const navBarCategories = rootData?.navBarCategories ?? [];
  const fallback = (
    <div className="min-h-[35rem] px-4 py-8 flex justify-center">
      <div className="px-8 flex flex-col justify-center">
        <p className="max-w-[384px] mb-2 text-lg leading-[26px] font-semibold text-center">
          Something went wrong.
        </p>
        <p className="max-w-[384px] mb-2 text-lg leading-[26px] font-semibold text-center">
          Please try again.
        </p>
      </div>
    </div>
  );

  if (isRouteErrorResponse(error) && error.status === httpStatus.NOT_FOUND) {
    const data = (error.data ?? {}) as { query?: string };
    return (
      <V2Layout
        categories={categories}
        navBarCategories={navBarCategories}
      >
        <div className="min-h-[35rem] px-4 py-8 flex justify-center">
          <div className="px-8 flex flex-col justify-center">
            <p className="max-w-[384px] mb-2 text-lg leading-[26px] font-semibold text-center">
              No product found for: {data.query}
            </p>
            <p className="max-w-[384px] mb-2 text-lg leading-[26px] font-semibold text-center">
              Please try search again, check your key word or try another word.
            </p>
          </div>
        </div>
      </V2Layout>
    );
  }

  return (
    <V2Layout
      categories={categories}
      navBarCategories={navBarCategories}
    >
      {fallback}
    </V2Layout>
  );
}

function Search() {
  const loaderData = useLoaderData<LoaderData>();
  const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
  const categories = rootData?.categories ?? [];
  const navBarCategories = rootData?.navBarCategories ?? [];
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

  const handleLoadMore = () => {
    const nextPage = currPageRef.current + 1;
    const params = new URLSearchParams({
      action_type: 'search_more',
      query: loaderData.query,
      page: nextPage.toString(),
    });

    loadMoreFetcher.load(`/search?${params.toString()}`);
  };

  const hasMore = state.current < state.total;

  return (
    <V2Layout
      categories={categories}
      navBarCategories={navBarCategories}
    >
      <div className="max-w-[var(--container-max)] mx-auto px-4 redesign-sm:px-6 redesign-md:px-12 py-4">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: `Search results for "${loaderData.query}"` },
          ]}
          className="px-0 mb-6"
        />

        <h1 className="font-heading text-2xl redesign-sm:text-3xl font-bold text-black mb-2">
          Search results for &ldquo;{loaderData.query}&rdquo;
        </h1>

        <SortBar current={state.current} total={state.total} />

        {state.products.length === 0 ? (
          <EmptyCollection />
        ) : (
          <ProductGrid
            products={state.products}
            loading={loadMoreFetcher.state !== 'idle'}
          />
        )}

        {state.total > 0 && (
          <div className="flex flex-col items-center mt-8 mb-8">
            <ProgressIndicator current={state.current} total={state.total} />
            {hasMore ? (
              <LoadMoreButton
                loading={loadMoreFetcher.state !== 'idle'}
                onClick={handleLoadMore}
              >
                Load More
              </LoadMoreButton>
            ) : (
              <p className="font-body text-[13px] text-rd-text-secondary mt-6">
                You've reached the end
              </p>
            )}
          </div>
        )}
      </div>
    </V2Layout>
  );
}

export default Search;

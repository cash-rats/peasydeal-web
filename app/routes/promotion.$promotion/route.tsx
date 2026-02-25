import { useMemo, useReducer, useRef, useEffect } from 'react';
import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import {
  useLoaderData,
  useFetcher,
  useParams,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router';
import httpStatus from 'http-status-codes';

import { PAGE_LIMIT } from '~/shared/constants';
import {
  getCanonicalDomain,
  getFourOhFourTitleText,
  getFourOhFourDescText,
  getCollectionTitleText,
  getPromotionDescText,
  getCategoryFBSEO_V2,
} from '~/utils/seo';

import {
  CollectionHeader,
  ProductGrid,
  SortBar,
  ProgressIndicator,
  EmptyCollection,
} from '~/components/v2/CollectionPage';
import { LoadMoreButton } from '~/components/v2/LoadMore/LoadMore';
import { NotFoundPage } from '~/components/v2/ErrorPage';

import { loadProducts, loadMoreProducts } from './loaders';
import type { LoadProductsDataType, LoadMoreDataType } from './types';
import reducer, { PromotionActionType } from './reducer';
import structuredData from './structured_data';

type LoaderType = 'load_products' | 'load_more_products';

export const handle = { structuredData };

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  const { promotion = '' } = params;

  if (!data || !promotion || !data.categories || !data.categories[promotion]) {
    return [
      { title: getFourOhFourTitleText('Promotion') },
      {
        tagName: 'meta',
        name: 'description',
        content: getFourOhFourDescText('Promotion'),
      },
    ];
  }

  const { category = {} } = data || {};
  return [
    { title: getCollectionTitleText(category?.title) },
    {
      tagName: 'meta',
      name: 'description',
      content: getPromotionDescText(category?.title, category?.description),
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: data?.canonical_link || getCanonicalDomain(),
    },
    ...getCategoryFBSEO_V2(category?.title, category?.description),
  ];
};

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const loaderType = (url.searchParams.get('action_type') || 'load_products') as LoaderType;

  if (!params.promotion) {
    throw Response.json('promotion not found', {
      status: httpStatus.BAD_REQUEST,
    });
  }

  if (loaderType === 'load_products') {
    const page = Number(url.searchParams.get('page'));
    const perpage = Number(url.searchParams.get('per_page')) || PAGE_LIMIT;

    return loadProducts({
      request,
      page,
      perpage,
      promoName: params.promotion,
    });
  }

  if (loaderType === 'load_more_products') {
    const page = Number(url.searchParams.get('page'));
    const perpage = Number(url.searchParams.get('per_page')) || PAGE_LIMIT;

    return loadMoreProducts({
      request,
      page,
      perpage,
      promoName: params.promotion,
    });
  }

  throw Response.json('unrecognized action', {
    status: httpStatus.BAD_REQUEST,
  });
};

function Promotion() {
  const loaderData = useLoaderData<LoadProductsDataType>();
  const {
    products = [],
    total = 0,
    current = 0,
    hasMore = false,
    page = 1,
    category,
  } = loaderData || {};

  const [state, dispatch] = useReducer(reducer, {
    products,
    total,
    current,
    hasMore,
    page,
    category,
  });
  const currPage = useRef<number>(state.page || 1);

  const { promotion } = useParams();
  const loadMoreFetcher = useFetcher();

  const stateCategory = state.category;

  useEffect(() => {
    if (!category) return;
    if (stateCategory?.name === category.name) return;

    dispatch({
      type: PromotionActionType.change_category,
      payload: {
        category,
        products,
        page,
        current,
        total,
      },
    });
  }, [category, current, page, products, stateCategory?.name, total]);

  useEffect(() => {
    if (loadMoreFetcher.state !== 'idle') return;
    const fetcherData = loadMoreFetcher.data as LoadMoreDataType | undefined;
    if (!fetcherData) return;

    const { products: fetchedProducts, total: fetchedTotal, current: fetchedCurrent, category: dataCat, page: fetchedPage } = fetcherData;

    if (!category) return;
    if (fetchedProducts.length === 0 || dataCat?.name !== category.name) return;

    currPage.current = fetchedPage;

    dispatch({
      type: PromotionActionType.append_products,
      payload: {
        products: fetchedProducts,
        total: fetchedTotal,
        current: fetchedCurrent,
        page: fetchedPage,
      },
    });
  }, [loadMoreFetcher.state, loadMoreFetcher.data, category]);

  const handleLoadMore = () => {
    const nextPage = currPage.current + 1;

    const params = new URLSearchParams({
      action_type: 'load_more_products',
      promotion: promotion || '',
      page: nextPage.toString(),
      per_page: PAGE_LIMIT.toString(),
    });

    loadMoreFetcher.load(`/promotion/${promotion}?${params.toString()}`);
  };

  const breadcrumbItems = useMemo(() => {
    const items: Array<{ label: string; href?: string }> = [
      { label: 'Home', href: '/' },
    ];
    items.push({ label: stateCategory?.title });
    return items;
  }, [stateCategory]);

  const hasMore_ = state.current < state.total;

  return (
    <div className="max-w-[var(--container-max)] mx-auto px-4 redesign-sm:px-6 redesign-md:px-12 py-4">
      <CollectionHeader
        title={stateCategory?.title}
        description={stateCategory?.description}
        breadcrumbs={breadcrumbItems}
      />

      <div className="flex-1 min-w-0">
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
          <div className="flex flex-col items-center mt-8">
            <ProgressIndicator current={state.current} total={state.total} />
            {hasMore_ ? (
              <LoadMoreButton
                loading={loadMoreFetcher.state !== 'idle'}
                onClick={handleLoadMore}
              >
                Show More
              </LoadMoreButton>
            ) : (
              <p className="font-body text-[13px] text-rd-text-secondary mt-6">
                You've reached the end
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Promotion;

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFoundPage />;
    }
  }

  return <NotFoundPage />;
}

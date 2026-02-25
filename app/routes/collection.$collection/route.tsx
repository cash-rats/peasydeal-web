import { useEffect, useMemo, useReducer, useRef } from 'react';
import type { LinksFunction, LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from 'react-router';
import {
  data,
  redirect,
  useFetcher,
  useLoaderData,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router';
import httpStatus from 'http-status-codes';

import FourOhFour from '~/components/FourOhFour';
import { composErrorResponse } from '~/utils/error';
import { isFromGoogleStoreBot } from '~/utils';
import {
  getCanonicalDomain,
  getCollectionDescText,
  getCollectionTitleText,
  getCategoryFBSEO_V2,
  getFourOhFourDescText,
  getFourOhFourTitleText,
} from '~/utils/seo';
import { PAGE_LIMIT } from '~/shared/constants';

import { resolveCategoryName } from '~/api/resolve-category-name.server';
import { productsLoader, loadmoreProductsLoader } from './loaders';
import reducer, { CollectionActionType } from './reducer';
import type { LoaderDataType, LoadMoreDataType } from './types';
import structuredData from './structured_data';

import {
  CollectionHeader,
  CategorySidebar,
  CategoryDrawer,
  ProductGrid,
  SortBar,
  ProgressIndicator,
  EmptyCollection,
} from '~/components/v2/CollectionPage';
import { LoadMoreButton } from '~/components/v2/LoadMore/LoadMore';
import type { CategoryItem } from '~/components/v2/CollectionPage';

export const handle = { structuredData };

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  if (!data || !params.collection) {
    return [
      {
        title: getFourOhFourTitleText(),
      },
      {
        tagName: 'meta',
        name: 'description',
        content: getFourOhFourDescText(),
      },
    ];
  }

  const { category = {} } = data || {};

  return [
    { title: getCollectionTitleText(category?.title) },
    {
      tagName: 'meta',
      name: 'description',
      description: getCollectionDescText(category?.title, category?.description),
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: data?.canonical_link || getCanonicalDomain(),
    },
    ...getCategoryFBSEO_V2(category?.title, category?.description),
  ];
};

type LoaderType = 'load_products' | 'loadmore';

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const actionType = (url.searchParams.get('action_type') || 'load_products') as LoaderType;
  const { collection = '' } = params;

  try {
    const resolvedCategoryName = await resolveCategoryName(collection);
    if (resolvedCategoryName !== collection) {
      return redirect(`/collection/${resolvedCategoryName}`);
    }
  } catch (e: any) {
    throw data(composErrorResponse(e.message));
  }

  if (actionType === 'loadmore') {
    const page = Number(url.searchParams.get('page'));
    const perpage = Number(url.searchParams.get('per_page')) || PAGE_LIMIT;
    return loadmoreProductsLoader({
      request,
      category: collection,
      page,
      perpage,
    });
  }

  if (actionType === 'load_products') {
    const perpage = Number(url.searchParams.get('per_page')) || PAGE_LIMIT;
    return productsLoader({
      request,
      category: collection,
      perpage,
    });
  }

  throw data(composErrorResponse(`unrecognize loader action ${actionType}`), {
    status: httpStatus.INTERNAL_SERVER_ERROR,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const productID = body.get('product_id');
  return redirect(`/product/${productID}`);
};

const getCategoryFromWindowPath = (windowObj: Window): string => {
  const pathname = windowObj.location.pathname;
  const category = pathname.substring(pathname.lastIndexOf('/') + 1);
  return category;
};

function Collection() {
  const loaderData = useLoaderData<LoaderDataType>() || ({} as LoaderDataType);
  const { category, products, page, total, current, hasMore } = loaderData;
  const [state, dispatch] = useReducer(reducer, {
    products,
    current,
    total,
    hasMore,
    category,
  });

  const currPage = useRef(state.current);
  const loadmoreFetcher = useFetcher();

  useEffect(() => {
    dispatch({
      type: CollectionActionType.set_products,
      payload: {
        products,
        total,
        current,
        category,
      },
    });
    currPage.current = page;
  }, [category, current, page, products, total]);

  useEffect(() => {
    if (loadmoreFetcher.state !== 'idle') return;
    const fetcherData = loadmoreFetcher.data as LoadMoreDataType | undefined;
    if (!fetcherData) return;

    const { products: fetchedProducts, total: fetchedTotal, current: fetchedCurrent, page: fetchedPage, category: dataCat } =
      fetcherData;

    if (fetchedProducts.length === 0 || dataCat !== category.name) return;

    currPage.current = fetchedPage;

    dispatch({
      type: CollectionActionType.append_products,
      payload: {
        products: fetchedProducts,
        total: fetchedTotal,
        current: fetchedCurrent,
      },
    });
  }, [loadmoreFetcher.state, loadmoreFetcher.data, category]);

  const handleLoadMore = () => {
    const categoryName = getCategoryFromWindowPath(window);
    const nextPage = currPage.current + 1;

    const params = new URLSearchParams({
      action_type: 'loadmore',
      page: nextPage.toString(),
      per_page: PAGE_LIMIT.toString(),
    });

    loadmoreFetcher.load(`/collection/${decodeURI(categoryName)}?${params.toString()}`);
  };

  const { category: stateCategory } = state;
  const parentCategories = category?.parents ?? [];
  const lastParent = parentCategories.length > 0 ? parentCategories[parentCategories.length - 1] : null;
  const childCategories = category?.children ?? [];

  // Breadcrumbs for CollectionHeader
  const breadcrumbItems = useMemo(() => {
    const items: Array<{ label: string; href?: string }> = [
      { label: 'Home', href: '/' },
    ];
    if (stateCategory?.parents) {
      for (const p of stateCategory.parents) {
        items.push({ label: p.title, href: `/collection/${p.name}` });
      }
    }
    items.push({ label: stateCategory?.title });
    return items;
  }, [stateCategory]);

  // Map child categories for CategorySidebar & CategoryDrawer
  const sidebarCategories: CategoryItem[] = useMemo(() =>
    childCategories
      .filter(c => c.count > 0)
      .map(c => ({
        name: c.name,
        label: c.title,
        count: c.count,
        href: `/collection/${c.name}`,
      })),
    [childCategories],
  );

  const hasMore_ = state.current < state.total;

  return (
    <div className="max-w-[var(--container-max)] mx-auto px-4 redesign-sm:px-6 redesign-md:px-12 py-4">
      <CollectionHeader
        title={stateCategory?.title}
        description={stateCategory?.description}
        breadcrumbs={breadcrumbItems}
      />

      {/* Mobile category drawer */}
      <CategoryDrawer
        categories={sidebarCategories}
        activeCategoryName={stateCategory?.name}
        activeLabel={`All ${stateCategory?.title} (${state.total})`}
      />

      <div className="flex gap-10">
        {/* Desktop sidebar */}
        <CategorySidebar
          parentLabel={lastParent?.title}
          parentHref={lastParent ? `/collection/${lastParent.name}` : undefined}
          categories={sidebarCategories}
          activeCategoryName={stateCategory?.name}
        />

        {/* Products */}
        <div className="flex-1 min-w-0">
          <SortBar current={state.current} total={state.total} />

          {state.products.length === 0 ? (
            <EmptyCollection />
          ) : (
            <ProductGrid
              products={state.products}
              loading={loadmoreFetcher.state !== 'idle'}
            />
          )}

          {state.total > 0 && (
            <div className="flex flex-col items-center mt-8">
              <ProgressIndicator current={state.current} total={state.total} />
              {hasMore_ ? (
                <LoadMoreButton
                  loading={loadmoreFetcher.state !== 'idle'}
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
    </div>
  );
}

export default Collection;

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <FourOhFour />;
    }
  }

  return <FourOhFour />;
}

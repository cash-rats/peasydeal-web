import { useEffect, useReducer, useRef, useState } from 'react';
import type { LinksFunction, LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from 'react-router';
import {
  data,
  redirect,
  useFetcher,
  useLoaderData,
  NavLink,
  Link,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router';
import httpStatus from 'http-status-codes';
import { VscChevronDown, VscArrowLeft } from 'react-icons/vsc';

import PromoteSubscriptionModal from '~/components/PromoteSubscriptionModal';
import LoadMoreButton from '~/components/LoadMoreButton';
import AllTimeCoupon, { links as AllTimeCouponLink } from '~/components/AllTimeCoupon';
import PageTitle from '~/components/PageTitle';
import FourOhFour from '~/components/FourOhFour';
import ThreeColumns, { links as ProductRowsContainerLinks } from '~/components/ProductRowsContainer/ThreeColumns';
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

import { Button } from '~/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet';
import { FiChevronRight } from 'react-icons/fi';

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

export const links: LinksFunction = () => [...AllTimeCouponLink(), ...ProductRowsContainerLinks()];

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
  const { category, products, page, total, current, hasMore, userAgent } = loaderData;
  const [state, dispatch] = useReducer(reducer, {
    products,
    current,
    total,
    hasMore,
    category,
  });

  const [isSheetOpen, setIsSheetOpen] = useState(false);
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

  const parentCategories = category?.parents ?? [];
  const parentExist = parentCategories.length > 0;
  const lastParent = parentExist ? parentCategories[parentCategories.length - 1] : null;
  const { category: stateCategory } = state;
  const childCategories = category?.children ?? [];
  const breadcrumbs = [
    {
      key: 'collection_breadcrumbs_first',
      label: 'Home',
      to: '/',
      isCurrent: false,
    },
    ...(stateCategory?.parents?.map((p) => ({
      key: `collection_breadcrumbs_${p.catId}`,
      label: p.title,
      to: `/collection/${p.name}`,
      isCurrent: false,
    })) ?? []),
    {
      key: 'collection_breadcrumbs_last',
      label: stateCategory?.title,
      to: `/collection/${stateCategory?.name}`,
      isCurrent: true,
    },
  ];
  const progressPercent = state.total ? Math.floor((state.current / state.total) * 100) : 0;

  return (
    <>
      <div className="w-full mb-2.5 md:pb-8">
        <AllTimeCoupon isFullLayout />
      </div>

      <PromoteSubscriptionModal forceDisable={isFromGoogleStoreBot(userAgent)} />

      <div className="py-0 px-auto flex flex-col justify-center items-center mx-2 md:mx-4">
        <nav className="w-full py-2.5 max-w-screen-xl mx-auto" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm md:text-base font-semibold">
            {breadcrumbs.map((crumb, index) => {
              if (!crumb.label) return null;
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li key={crumb.key} className="flex items-center gap-1">
                  <NavLink
                    to={crumb.to}
                    aria-current={crumb.isCurrent ? 'page' : undefined}
                    className={crumb.isCurrent ? '!text-[#D02E7D]' : undefined}
                  >
                    {crumb.label}
                  </NavLink>
                  {!isLast ? <FiChevronRight className="text-[16px] md:text-[24px]" /> : null}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="w-full mb-0 md:mb-8">
          <PageTitle title={stateCategory?.title} subtitle={stateCategory?.description} />
        </div>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <div
            className="flex md:hidden w-full py-2 max-w-screen-xl mx-auto border-b-[1px] border-solid border-[#d8d8d8] z-20 bg-white"
          >
            <SheetTrigger asChild>
              <button
                className="
              flex items-center justify-between
              font-bold px-4 py-2.5
              shadow-sm rounded-lg border-[1px] border-solid border-[#AAA]
              cursor-pointer
              active:outline-blue-500
              active:outline-2
              w-full
              color-slate-800
            "
                onClick={() => {
                  window.rudderanalytics?.track('click_open_category_halfsheet', {
                    category: stateCategory?.name,
                  });
                }}
              >
                <span>{`All ${stateCategory?.title} (${state.total})`}</span>
                <VscChevronDown fontSize={16} />
              </button>
            </SheetTrigger>
          </div>

          <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto px-0">
            <SheetHeader className="px-6">
              <SheetTitle>Shop by Category</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-0">
              <span className="py-2 px-6 font-bold">{`All ${stateCategory?.title} (${state.total})`}</span>
              {childCategories.map((subcat, index) =>
                subcat.count > 0 ? (
                  <Button
                    asChild
                    variant="ghost"
                    className="justify-start whitespace-normal rounded-none px-6 py-4 text-left"
                    key={`mobile_${subcat.name}_${index}`}
                  >
                    <Link
                      to={`/collection/${subcat.name}`}
                      onClick={() => {
                        window.rudderanalytics?.track('click_sub_category', {
                          category: subcat.name,
                          layout: 'mobile',
                        });
                        setIsSheetOpen(false);
                      }}
                    >
                      {subcat.title} ({subcat.count})
                    </Link>
                  </Button>
                ) : null
              )}
            </div>
          </SheetContent>
        </Sheet>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-screen-xl mx-auto mb-4">
          <div className="hidden md:flex md:col-span-1 lg:col-span-1 ">
            <div className="border border-[#d8d8d8] rounded-sm flex flex-col p-4 w-full gap-1">
              {parentExist && lastParent !== null ? (
                <Button
                  asChild
                  variant="ghost"
                  className="mb-4 justify-start gap-2 text-left"
                >
                  <Link to={`/collection/${lastParent.name}`}>
                    <VscArrowLeft />
                    {`${lastParent.title}`}
                  </Link>
                </Button>
              ) : null}
              <span className="py-2 px-4 font-bold">{`All ${stateCategory?.title} (${state.total})`}</span>
              {childCategories.map((subcat, index) =>
                subcat.count > 0 ? (
                  <Button
                    asChild
                    variant="ghost"
                    className="justify-start whitespace-normal text-left"
                    key={`${subcat.name}_${index}`}
                  >
                    <Link
                      to={`/collection/${subcat.name}`}
                      onClick={() => {
                        window.rudderanalytics?.track('click_sub_category', {
                          category: subcat.name,
                          layout: 'desktop',
                        });
                      }}
                    >
                      {subcat.title} ({subcat.count})
                    </Link>
                  </Button>
                ) : null
              )}
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            {state.products.length === 0 && (
              <h2 className="p4 text-center">
                {stateCategory?.title} has no product, please checkout other categories.
              </h2>
            )}
            <ThreeColumns products={state.products} />
          </div>
        </div>

        {state.total > 0 && (
          <div className="
              p-4 w-[300px]
              flex justify-center items-center
              flex-col gap-4
            ">
            <p className="font-poppins">Showing {state.current} of {state.total}</p>

            <div
              className="h-2 w-full rounded-full bg-slate-200"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${Math.min(100, progressPercent)}%` }}
              />
            </div>

            {state.hasMore ? (
              <LoadMoreButton loading={loadmoreFetcher.state !== 'idle'} onClick={handleLoadMore} text='Show More' />
            ) : (
              <p className="font-poppins capitalize font-medium">Reaches end of list.</p>
            )}
          </div>
        )}
      </div>
    </>
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

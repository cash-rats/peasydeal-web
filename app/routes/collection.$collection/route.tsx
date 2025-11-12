import { useEffect, useRef, useReducer } from 'react';
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
import type { DynamicLinksFunction } from 'remix-utils';
import httpStatus from 'http-status-codes';
import { Progress } from '@chakra-ui/react';
import { BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { VscChevronDown, VscArrowLeft } from 'react-icons/vsc';

import PromoteSubscriptionModal from '~/components/PromoteSubscriptionModal';
import Breadcrumbs, { links as BreadCrumbLink } from '~/components/Breadcrumbs/Breadcrumbs';
import LoadMoreButton from '~/components/LoadMoreButton';
import AllTimeCoupon, { links as AllTimeCouponLink } from '~/components/AllTimeCoupon';
import PageTitle from '~/components/PageTitle';
import FourOhFour from '~/components/FourOhFour';
import ThreeColumns, { links as ProductRowsContainerLinks } from '~/routes/__index/components/ProductRowsContainer/ThreeColumns';
import { composErrorResponse } from '~/utils/error';
import { isFromGoogleStoreBot } from '~/utils';
import { getCanonicalDomain, getCollectionDescText, getCollectionTitleText, getCategoryFBSEO_V2, getFourOhFourDescText, getFourOhFourTitleText } from '~/utils/seo';
import { PAGE_LIMIT } from '~/shared/constants';

import { resolveCategoryName } from '~/api/resolve-category-name.server';
import { productsLoader, loadmoreProductsLoader } from './loaders';
import reducer, { CollectionActionType } from './reducer';
import type { LoaderDataType, LoadMoreDataType } from './types';
import structuredData from './structured_data';

import { Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Button, useDisclosure } from '@chakra-ui/react';

const dynamicLinks: DynamicLinksFunction<LoaderDataType> = ({ data }) => [
  {
    rel: 'canonical',
    href: data?.canonical_link || getCanonicalDomain(),
  },
];

export const handle = { dynamicLinks, structuredData };

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
    ...getCategoryFBSEO_V2(category?.title, category?.description),
  ];
};

export const links: LinksFunction = () => [
  ...AllTimeCouponLink(),
  ...BreadCrumbLink(),
  ...ProductRowsContainerLinks(),
];

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
  const mobileSubCatHalfSheetRef = useRef<HTMLDivElement | null>(null);
  const loaderData = useLoaderData<LoaderDataType>() || ({} as LoaderDataType);
  const { category, products, page, total, current, hasMore, userAgent } = loaderData;
  const [state, dispatch] = useReducer(reducer, {
    products,
    current,
    total,
    hasMore,
    category,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const subCatRef = useRef<HTMLButtonElement | null>(null);
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
    if (loadmoreFetcher.type === 'done') {
      const { products: fetchedProducts, total: fetchedTotal, current: fetchedCurrent, page: fetchedPage, category: dataCat } =
        loadmoreFetcher.data as LoadMoreDataType;

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
    }
  }, [loadmoreFetcher.type, category]);

  const handleLoadMore = () => {
    const categoryName = getCategoryFromWindowPath(window);
    const nextPage = currPage.current + 1;

    loadmoreFetcher.submit(
      {
        action_type: 'loadmore',
        page: nextPage.toString(),
        per_page: PAGE_LIMIT.toString(),
      },
      { action: `/collection/${decodeURI(categoryName)}?index` }
    );
  };

  const parentExist = category.parents && category.parents.length > 0;
  const lastParent = parentExist ? category.parents[category.parents.length - 1] : null;
  const { category: stateCategory } = state;

  return (
    <>
      <div className="w-full mb-2.5 md:pb-8">
        <AllTimeCoupon isFullLayout />
      </div>

      <PromoteSubscriptionModal forceDisable={isFromGoogleStoreBot(userAgent)} />

      <div className="py-0 px-auto flex flex-col justify-center items-center mx-2 md:mx-4">
        <div className="w-full py-2.5 max-w-screen-xl mx-auto">
          <Breadcrumbs
            breadcrumbs={[
              <BreadcrumbItem key='collection_breadcrumbs_first'>
                <BreadcrumbLink as={NavLink} to='/' className="font-semibold">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>,

              ...(stateCategory?.parents?.map((p) => (
                <BreadcrumbItem key={`collection_breadcrumbs_${p.catId}`}>
                  <BreadcrumbLink as={NavLink} to={`/collection/${p.name}`} isCurrentPage className="font-semibold !text-[#D02E7D]">
                    {p.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              )) ?? []),

              <BreadcrumbItem key='collection_breadcrumbs_last'>
                <BreadcrumbLink
                  as={NavLink}
                  to={`/collection/${stateCategory?.name}`}
                  isCurrentPage
                  className="font-semibold !text-[#D02E7D]"
                >
                  {stateCategory?.title}
                </BreadcrumbLink>
              </BreadcrumbItem>,
            ]}
          />
        </div>

        <div className="w-full mb-0 md:mb-8">
          <PageTitle title={stateCategory?.title} subtitle={stateCategory?.description} />
        </div>

        <div
          className="flex md:hidden w-full py-2 max-w-screen-xl mx-auto border-b-[1px] border-solid border-[#d8d8d8] z-20 bg-white"
          ref={mobileSubCatHalfSheetRef}
        >
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
            ref={subCatRef}
            onClick={() => {
              window.rudderanalytics?.track('click_open_category_halfsheet', {
                category: stateCategory.name,
              });
              onOpen();
            }}
          >
            <span>{`All ${stateCategory?.title} (${state.total})`}</span>
            <VscChevronDown fontSize={16} />
          </button>
        </div>

        <Drawer isOpen={isOpen} placement='bottom' onClose={onClose} finalFocusRef={subCatRef}>
          <DrawerOverlay />
          <DrawerContent maxH='80vh'>
            <DrawerCloseButton />
            <DrawerHeader>Shop by Category</DrawerHeader>

            <DrawerBody>
              <div className="flex flex-col gap-0">
                <span className="py-2 px-4 font-bold">{`All ${stateCategory?.title} (${state.total})`}</span>
                {category.children.map((subcat, index) =>
                  subcat.count > 0 ? (
                    <Link to={`/collection/${subcat.name}`} key={`mobile_${subcat.name}_${index}`}>
                      <Button
                        className="justify-start whitespace-normal w-full"
                        colorScheme="pink"
                        variant="ghost"
                        onClick={() => {
                          window.rudderanalytics?.track('click_sub_category', {
                            category: subcat.name,
                            layout: 'mobile',
                          });
                          onClose();
                        }}
                      >
                        {subcat.title} ({subcat.count})
                      </Button>
                    </Link>
                  ) : null
                )}
              </div>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-screen-xl mx-auto mb-4">
          <div className="hidden md:flex md:col-span-1 lg:col-span-1 ">
            <div className="border border-[#d8d8d8] rounded-sm flex flex-col p-4 w-full gap-1">
              {parentExist && lastParent !== null ? (
                <Link to={`/collection/${lastParent.name}`}>
                  <Button className="text-left mb-4" variant="ghost" leftIcon={<VscArrowLeft />}>
                    {`${lastParent.title}`}
                  </Button>
                </Link>
              ) : null}
              <span className="py-2 px-4 font-bold">{`All ${stateCategory?.title} (${state.total})`}</span>
              {category.children.map((subcat, index) =>
                subcat.count > 0 ? (
                  <Link to={`/collection/${subcat.name}`} key={`${subcat.name}_${index}`}>
                    <Button
                      className="text-left whitespace-normal"
                      colorScheme="pink"
                      variant="ghost"
                      onClick={() => {
                        window.rudderanalytics?.track('click_sub_category', {
                          category: subcat.name,
                          layout: 'desktop',
                        });
                      }}
                    >
                      {subcat.title} ({subcat.count})
                    </Button>
                  </Link>
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

            <Progress className="w-full" size='sm' value={Math.floor((state.current / state.total) * 100)} colorScheme='teal' />

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

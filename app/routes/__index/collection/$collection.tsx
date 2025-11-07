import { useEffect, useRef, useReducer } from "react";
import type {
  LinksFunction,
  LoaderFunction,
  ActionFunction,
  V2_MetaFunction,
} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  useFetcher,
  useLoaderData,
  NavLink,
  Link,
} from 'react-router';
import httpStatus from 'http-status-codes';
import type { DynamicLinksFunction } from 'remix-utils';
import { Progress } from '@chakra-ui/react';
import { VscChevronDown, VscArrowLeft } from "react-icons/vsc";
import { BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react'

import PromoteSubscriptionModal from '~/components/PromoteSubscriptionModal';
import { PAGE_LIMIT } from '~/shared/constants';
import Breadcrumbs, { links as BreadCrumbLink } from '~/components/Breadcrumbs/Breadcrumbs';
import LoadMoreButton from '~/components/LoadMoreButton';
import AllTimeCoupon, { links as AllTimeCouponLink } from '~/components/AllTimeCoupon';
import {
  getCanonicalDomain,
  getCollectionDescText,
  getCollectionTitleText,
  getCategoryFBSEO_V2,
  getFourOhFourTitleText,
  getFourOhFourDescText,
} from '~/utils/seo';
import PageTitle from '~/components/PageTitle';
import FourOhFour from '~/components/FourOhFour';
import { composErrorResponse } from '~/utils/error';
import { isFromGoogleStoreBot } from '~/utils';

import { resolveCategoryName } from '../api/resolve_category_name.server';
import ThreeColumns, { links as ProductRowsContainerLinks } from '../components/ProductRowsContainer/ThreeColumns';
import { productsLoader, loadmoreProductsLoader } from './loaders';
import reducer, { CollectionActionType } from './reducer';
import type { LoaderDataType, LoadMoreDataType } from './types';
import structuredData from './structured_data';

import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useDisclosure,
} from '@chakra-ui/react'


const dynamicLinks: DynamicLinksFunction<LoaderDataType> = ({ data }) => ([
  {
    rel: 'canonical',
    href: data?.canonical_link || getCanonicalDomain(),
  },
])

export const handle = { dynamicLinks, structuredData };

export const meta: V2_MetaFunction<typeof loader> = ({ data, params }) => {
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
      description: getCollectionDescText(
        category?.title,
        category?.description,
      ),
    },
    ...getCategoryFBSEO_V2(
      category?.title,
      category?.description,
    ),
  ];
};

export const links: LinksFunction = () => {
  return [
    ...AllTimeCouponLink(),
    ...BreadCrumbLink(),
    ...ProductRowsContainerLinks(),
  ];
};

type LoaderType = 'load_products' | 'loadmore';

export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url);
  const actionType = url.searchParams.get('action_type') || 'load_products' as LoaderType;
  const { collection = '' } = params;

  try {
    const resolvedCategoryName = await resolveCategoryName(collection);
    if (resolvedCategoryName !== collection) {
      return redirect(`/collection/${resolvedCategoryName}`)
    }
  } catch (e: any) {
    throw json(composErrorResponse(e.message))
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

  throw json(
    composErrorResponse(
      `unrecognize loader action ${actionType}`),
    { status: httpStatus.INTERNAL_SERVER_ERROR },
  );
}

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const productID = body.get("product_id");
  return redirect(`/product/${productID}`);
};

// When collection is not found
export const CatchBoundary = () => (<FourOhFour />);

const getCategoryFromWindowPath = (window: Window): string => {
  const pathname = window.location.pathname;
  const category = pathname.substring(pathname.lastIndexOf('/') + 1);
  return category;
};

type CollectionProps = {};

function Collection() {
  const mobileSubCatHalfSheetRef = useRef(null);
  const {
    category,
    products,
    page,
    total,
    current,
    hasMore,
    userAgent,
  } = useLoaderData<LoaderDataType>() || {};

  const [state, dispatch] = useReducer(reducer, {
    products,
    current,
    total,
    hasMore,
    category,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const subCatRef = useRef(null);

  const currPage = useRef(state.current);

  const loadmoreFetcher = useFetcher();

  // For any subsequent change of category, we will update current product info coming from loader data.
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
  }, [category]);

  useEffect(() => {
    if (loadmoreFetcher.type === 'done') {
      const {
        products,
        total,
        current,
        page,
        category: dataCat,
      } = loadmoreFetcher.data as LoadMoreDataType;

      // If user changes category while load more is happening, the newly loaded data
      // would be appended to different category. Moreover, it would cause inconsistent
      // page number. Thus, we abandon appending loaded data on to the product list
      // if category of data is different from current viewing category.
      if (
        products.length === 0 ||
        dataCat !== category.name
      ) return;

      currPage.current = page;

      dispatch({
        type: CollectionActionType.append_products,
        payload: {
          products,
          total,
          current,
        },
      });
    }
  }, [loadmoreFetcher.type, category]);


  const handleLoadMore = () => {
    const category = getCategoryFromWindowPath(window);
    const nextPage = currPage.current + 1;

    loadmoreFetcher.submit(
      {
        action_type: 'loadmore',
        page: nextPage.toString(),
        per_page: PAGE_LIMIT.toString(),
      },
      { action: `/collection/${decodeURI(category)}?index` },
    );
  };

  const parentExist = category.parents && category.parents.length > 0;
  const lastParent = parentExist ? category.parents[category.parents.length - 1] : null;

  const {
    category: stateCategory,
  } = state;

  return (
    <>
      <div className="w-full mb-2.5 md:pb-8">
        <AllTimeCoupon isFullLayout />
      </div>

      <PromoteSubscriptionModal forceDisable={isFromGoogleStoreBot(userAgent)} />

      <div className="
        py-0 px-auto
        flex flex-col
        justify-center items-center
        mx-2 md:mx-4
      ">
        <div className="w-full py-2.5 max-w-screen-xl mx-auto">
          <Breadcrumbs breadcrumbs={
            [
              <BreadcrumbItem key='collection_breadcrumbs_first'>
                <BreadcrumbLink as={NavLink} to='/' className="font-semibold">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>,

              ...stateCategory?.parents.map(p => (
                <BreadcrumbItem key={`collection_breadcrumbs_${p.catId}`}>
                  <BreadcrumbLink
                    as={NavLink}
                    to={`/collection/${p.name}`}
                    isCurrentPage
                    className="font-semibold !text-[#D02E7D]"
                  >
                    {p.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              )),

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
            ]
          } />
        </div>

        <div className="w-full mb-0 md:mb-8">
          <PageTitle
            title={stateCategory?.title}
            subtitle={stateCategory?.description}
          />
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
            <span>
              {`All ${stateCategory?.title} (${state.total})`}
            </span>
            <VscChevronDown fontSize={16} />
          </button>
        </div>

        <Drawer
          isOpen={isOpen}
          placement='bottom'
          onClose={onClose}
          finalFocusRef={subCatRef}
        >
          <DrawerOverlay />
          <DrawerContent maxH='80vh'>
            <DrawerCloseButton />
            <DrawerHeader>Shop by Category</DrawerHeader>

            <DrawerBody>
              <div className="flex flex-col gap-0">
                <span className="py-2 px-4 font-bold">
                  {
                    `All ${stateCategory?.title} (${state.total})`
                  }
                </span>
                {
                  category.children.map((subcat, index) => (
                    subcat.count > 0 ? (<Link to={`/collection/${subcat.name}`} key={`mobile_${subcat.name}_${index}`}>
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
                    </Link>) : null
                  ))
                }
              </div>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Create Tailwind Css 4 col grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-screen-xl mx-auto mb-4">
          {/* Side Panel for subcategory */}
          <div className="hidden md:flex md:col-span-1 lg:col-span-1 ">
            <div className="border border-[#d8d8d8] rounded-sm flex flex-col p-4 w-full gap-1">
              {
                parentExist && lastParent !== null ? (
                  <Link to={`/collection/${lastParent.name}`}>
                    <Button className="text-left mb-4" variant="ghost" leftIcon={<VscArrowLeft />}>
                      {`${lastParent.title}`}
                    </Button>
                  </Link>
                ) : null
              }
              <span className="py-2 px-4 font-bold">
                {
                  `All ${stateCategory?.title} (${state.total})`
                }
              </span>
              {
                category.children.map((subcat, index) => (
                  subcat.count > 0 ? (<Link to={`/collection/${subcat.name}`} key={`${subcat.name}_${index}`}>
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
                  </Link>) : null
                ))
              }
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            {
              state.products.length === 0 && (
                <h2 className="p4 text-center">{stateCategory?.title}
                  has no product, please checkout other categories.
                </h2>
              )
            }
            {/*
              @important
              Please don't enable product grid loading state when redirecting for now.
              It disrupts the scroll position stored in the session storage. I'm trying
              to fix this behavior using remix frontend cache. We'll retrieve loaded list
              from browser cache before going to the loader

              refs:
                - https://github.com/remix-run/remix/discussions/4652
                - https://github.com/remix-run/remix/discussions/4950
            */}
            <ThreeColumns
              products={state.products}
            />
          </div>
        </div>

        {
          state.total > 0 && (
            <div className="
              p-4 w-[300px]
              flex justify-center items-center
              flex-col gap-4
            ">
              <p className="font-poppins">
                Showing {state.current} of {state.total}
              </p>

              <Progress
                className="w-full"
                size='sm'
                value={Math.floor((state.current / state.total) * 100)}
                colorScheme='teal'
              />

              {
                state.hasMore
                  ? (
                    <LoadMoreButton
                      loading={loadmoreFetcher.state !== 'idle'}
                      onClick={handleLoadMore}
                      text='Show More'
                    />
                  )
                  : (
                    <p className="font-poppins capitalize font-medium">
                      Reaches end of list.
                    </p>
                  )
              }
            </div>
          )
        }
      </div>
    </>
  );
}

export default Collection;
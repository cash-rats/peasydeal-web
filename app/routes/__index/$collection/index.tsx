import { useEffect, useRef, useReducer } from "react";
import type { LinksFunction, LoaderFunction, ActionFunction, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import {
  useTransition,
  useFetcher,
  useLoaderData,
  NavLink,
} from '@remix-run/react';
import httpStatus from 'http-status-codes';
import type { DynamicLinksFunction } from 'remix-utils';
import { trackWindowScroll } from "react-lazy-load-image-component";
import type { LazyComponentProps } from "react-lazy-load-image-component";
import { Progress } from '@chakra-ui/react';
import { BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react'

import { PAGE_LIMIT } from '~/shared/constants';
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs';
import LoadMoreButton from '~/components/LoadMoreButton';
import AllTimeCoupon, { links as AllTimeCouponLink } from '~/components/AllTimeCoupon';
import {
  getCanonicalDomain,
  getCollectionDescText,
  getCollectionTitleText,
  getCategoryFBSEO,
  getFourOhFourTitleText,
  getFourOhFourDescText,
} from '~/utils/seo';
import PageTitle from '~/components/PageTitle';
import FourOhFour, { links as FourOhFourLinks } from '~/components/FourOhFour';

import ProductRowsContainer, { links as ProductRowsContainerLinks } from '../components/ProductRowsContainer';
import { productsLoader, loadmoreProductsLoader } from './loaders';
import reducer, { CollectionActionType } from './reducer';
import type { LoaderDataType, LoadMoreDataType } from './types';
import structuredData from './structured_data';

const dynamicLinks: DynamicLinksFunction<LoaderDataType> = ({ data }) => ([
  {
    rel: 'canonical',
    href: data?.canonical_link || getCanonicalDomain(),
  },
])

export const handle = { dynamicLinks, structuredData };

export const meta: MetaFunction = ({ data, params }) => {
  if (
    !data ||
    !params.collection ||
    !data.categories[params.collection]
  ) {
    return {
      title: getFourOhFourTitleText(),
      description: getFourOhFourDescText(),
    }
  }

  return {
    title: getCollectionTitleText(data.category.title),
    description: getCollectionDescText(
      data.category.title,
      data.category.description,
    ),

    ...getCategoryFBSEO(
      data.category.title,
      data.category.description,
    ),
  }
};

export const links: LinksFunction = () => {
  return [
    ...AllTimeCouponLink(),
    ...FourOhFourLinks(),
    ...ProductRowsContainerLinks(),
  ];
};

type LoaderType = 'load_products' | 'load_category_products';

export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url);
  const actionType = url.searchParams.get('action_type') || 'load_products' as LoaderType;
  const { collection = '' } = params;

  try {
    if (actionType === 'load_category_products') {
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
  } catch (error) {
    throw json(`unrecognize loader action ${actionType}`, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

export const action: ActionFunction = async ({ request, params }) => {
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

type CollectionProps = {} & LazyComponentProps;

function Collection({ scrollPosition }: CollectionProps) {
  const {
    category,
    products,
    page,
    categories,
    total,
    current,
    hasMore,
  } = useLoaderData<LoaderDataType>();

  const [state, dispatch] = useReducer(reducer, {
    products,
    current,
    total,
    hasMore
  });

  const currPage = useRef(state.current);

  const loadmoreFetcher = useFetcher();
  const transition = useTransition();

  // For any subsequent change of category, we will update current product info coming from loader data.
  useEffect(() => {
    dispatch({
      type: CollectionActionType.set_products,
      payload: {
        products,
        total,
        current,
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
        dataCat.name !== category.name
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
        action_type: 'load_category_products',
        page: nextPage.toString(),
        per_page: PAGE_LIMIT.toString(),
      },
      { action: `/${decodeURI(category)}?index` },
    );
  };

  const isChangingCategory = transition.state !== 'idle' &&
    transition.location &&
    categories.hasOwnProperty(
      decodeURI(transition.location.pathname.substring(1))
    );

  return (
    <div className="
      py-0 px-auto
      flex flex-col
      justify-center items-center
      mx-2 md:mx-4
    ">
      <div className="w-full py-2.5 max-w-screen-xl mx-auto">
        <Breadcrumbs breadcrumbs={
          [
            <BreadcrumbItem key="1">
              <BreadcrumbLink as={NavLink} to='/' className="font-semibold">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>,
            <BreadcrumbItem key="2">
              <BreadcrumbLink
                as={NavLink}
                to={`/${category.name}`}
                isCurrentPage
                className="font-semibold !text-[#D02E7D]"
              >
                {category.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          ]
        } />
      </div>

      <PageTitle
        title={category.title}
        subtitle={category.description}
      />

      <div className="w-full pt-2.5 pb-8 max-w-screen-xl mx-auto">
        <AllTimeCoupon />
      </div>

      <ProductRowsContainer
        loading={isChangingCategory}
        products={state.products}
        scrollPosition={scrollPosition}
      />

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
    </div>
  );
}

export default trackWindowScroll(Collection);
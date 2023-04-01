import { useReducer, useRef, useEffect } from 'react';
import type { LoaderFunction, LinksFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useFetcher, useParams, NavLink, useTransition } from '@remix-run/react';
import httpStatus from 'http-status-codes';
import { trackWindowScroll } from "react-lazy-load-image-component";
import type { LazyComponentProps } from "react-lazy-load-image-component";
import { BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react'

import AllTimeCoupon, { links as AllTimeCouponLink } from '~/components/AllTimeCoupon';
import Breadcrumbs from '~/components/Breadcrumbs/Breadcrumbs';
import FourOhFour from '~/components/FourOhFour';
import LoadMoreButtonProgressBar from '~/components/LoadMoreButtonProgressBar';
import { PAGE_LIMIT } from '~/shared/constants';
import PromotionBannerWithTitle, { links as PageTitleLinks } from '~/components/PageTitle/PromotionBannerWithTitle';
import {
  getFourOhFourTitleText,
  getFourOhFourDescText,
  getCollectionTitleText,
  getCollectionDescText,
  getCategoryFBSEO,
} from '~/utils/seo';

import { loadProducts, loadMoreProducts } from './loaders';
import type { LoadProductsDataType, LoadMoreDataType } from './types';
import reducer, { PromotionActionType } from './reducer';
import ProductRowsContainer, { links as ProductRowsContainerLinks } from '../components/ProductRowsContainer';
import structuredData from './structured_data';

export const handle = { structuredData };

export const links: LinksFunction = () => {
  return [
    ...AllTimeCouponLink(),
    ...ProductRowsContainerLinks(),
    ...PageTitleLinks(),
  ];
};

export const meta: MetaFunction = ({ data, params }) => {
  const { promotion = '' } = params;

  if (
    !data ||
    !promotion ||
    !data.categories ||
    Object.keys(data.categories).length === 0 ||
    !data.categories[promotion]
  ) {
    return {
      title: getFourOhFourTitleText('Promotion'),
      description: getFourOhFourDescText('Promotion'),
    }
  }

  const { category = {} } = data || {};

  return {
    title: getCollectionTitleText(category?.title),
    description: getCollectionDescText(
      category?.title,
      category?.description,
    ),

    ...getCategoryFBSEO(
      category?.title,
      category?.description,
    ),
  };
};

type LoaderType = 'load_products' | 'load_more_products'

export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url);
  const loaderType = url.searchParams.get('action_type') || 'load_products' as LoaderType;

  // if promotion not provided.
  if (!params.promotion) {
    throw json('promotion not found', {
      status: httpStatus.BAD_REQUEST,
    })
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

  throw json('unrecognized action');
}

export const CatchBoundary = () => (<FourOhFour />);

type TPromotion = {} & LazyComponentProps;

function Promotion({ scrollPosition }: TPromotion) {
  const {
    products,
    total,
    current,
    hasMore,
    page,
    category,
    categories,
  } = useLoaderData<LoadProductsDataType>();

  const [state, dispatch] = useReducer(reducer, {
    products,
    total,
    current,
    hasMore,
    page,
    category,
  });
  const currPage = useRef<number>(state.page);

  const { promotion } = useParams();
  const loadMoreFetcher = useFetcher();
  const transition = useTransition();

  // If user changes promotion, we'll update the current category in reducer.
  useEffect(() => {
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
  }, [category]);

  useEffect(() => {
    if (loadMoreFetcher.type === 'done') {
      const {
        products,
        total,
        current,
        category: dataCat,
        page,
      } = loadMoreFetcher.data as LoadMoreDataType;

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
        type: PromotionActionType.append_products,
        payload: {
          products,
          total,
          current,
          page,
        },
      })
    }
  }, [loadMoreFetcher.type, category]);

  const handleLoadMore = () => {
    const nextPage = currPage.current + 1;

    loadMoreFetcher.submit(
      {
        action_type: 'load_more_products',
        promotion: promotion || '' as string,
        page: nextPage.toString(),
        per_page: PAGE_LIMIT.toString(),
      },
      { action: `/promotion/${promotion}?index` },
    );
  };

  const isChangingPromotion = transition.state !== 'idle' &&
    transition.location &&
    categories.hasOwnProperty(
      decodeURI(transition.location.pathname.substring(1))
    );

  const {
    category: stateCategory,
  } = state;

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
                to={`/promotion/${stateCategory?.name}`}
                isCurrentPage
                className="font-semibold !text-[#D02E7D]"
              >
                {stateCategory?.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          ]
        } />
      </div>

      <PromotionBannerWithTitle
        title={stateCategory?.title}
        subtitle={stateCategory?.description}
        superSale={stateCategory?.name === 'super_deal'}
      />

      <div className="w-full pt-2.5 pb-8 max-w-screen-xl mx-auto">
        <AllTimeCoupon />
      </div>

      <ProductRowsContainer
        loading={isChangingPromotion}
        products={state.products}
        scrollPosition={scrollPosition}
      />

      <LoadMoreButtonProgressBar
        loading={loadMoreFetcher.state !== 'idle'}
        current={state.current}
        total={state.total}
        onClickLoadMore={handleLoadMore}
      />
    </div>
  )
}

export default trackWindowScroll(Promotion);
import { useReducer } from 'react';
import type { LoaderFunction, LinksFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useFetcher, useParams, ShouldReloadFunction } from '@remix-run/react';
import httpStatus from 'http-status-codes';
import { trackWindowScroll } from "react-lazy-load-image-component";
import type { LazyComponentProps } from "react-lazy-load-image-component";

import FourOhFour from '~/components/FourOhFour';
import LoadMoreButtonProgressBar from '~/components/LoadMoreButtonProgressBar';
import { PAGE_LIMIT } from '~/shared/constants';

import { loadProducts, loadMoreProducts } from './loaders';
import type { LoadProductsDataType } from './loaders';
import reducer from './reducer';
import ProductRowsContainer, { links as ProductRowsContainerLinks } from '../components/ProductRowsContainer';
import { modToXItems } from "../utils";

export const links: LinksFunction = () => {
  return [
    ...ProductRowsContainerLinks(),
  ];
};

type LoaderType = 'load_products' | 'load_more_products'

export const unstable_shouldReload: ShouldReloadFunction = ({ submission }) => {
  console.log('debug unstable_shouldReload');

  if (submission) {
    console.log('submission action', submission.action)
  }

  return true;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url);
  const loaderType = url.searchParams.get('action_type') || 'load_products' as LoaderType;

  console.log('debug ** -1', params.promotion, typeof params.promotion);
  // if promotion not provided.
  if (
    typeof params.promotion === 'undefined' ||
    params.promotion === null
  ) {
    console.log('debug ** -2');
    throw json('promotion not found', {
      status: httpStatus.BAD_REQUEST,
    })
  }

  try {
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
      console.log('debug ** 2');
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
  } catch (error) {
    console.log('error', error);
  }
}

export const CatchBoundary = () => (<FourOhFour />);

type TPromotion = {} & LazyComponentProps;

function Promotion({ scrollPosition }: TPromotion) {
  const {
    products,
    total,
    current,
    hasMore,
  } = useLoaderData<LoadProductsDataType>();

  const [state, dispatch] = useReducer(reducer, {
    productRows: modToXItems(products),
    products,
    total,
    current,
    hasMore,
  });

  const { promotion } = useParams();
  // const loadMoreFetcher = useFetcher();

  const handleLoadMore = () => {
    console.log('promotion', promotion);
    // loadMoreFetcher.submit(
    //   {
    //     action_type: 'load_more_products',
    //   },
    //   { action: '' },
    // );
  };

  return (
    <div className="
      py-0 px-auto
      flex flex-col
      justify-center items-center
      mx-2 md:mx-4
    ">
      <ProductRowsContainer
        // loading={false}
        productRows={state.productRows}
        scrollPosition={scrollPosition}
      />

      <LoadMoreButtonProgressBar
        current={current}
        total={total}
        onClickLoadMore={handleLoadMore}
      />
    </div>
  )
}

export default trackWindowScroll(Promotion);
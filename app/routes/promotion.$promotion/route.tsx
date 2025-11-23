import { useReducer, useRef, useEffect } from 'react';
import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from 'react-router';
import {
  useLoaderData,
  useFetcher,
  useParams,
  NavLink,
  useNavigation,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router';
import httpStatus from 'http-status-codes';

import AllTimeCoupon, { links as AllTimeCouponLink } from '~/components/AllTimeCoupon';
import FourOhFour from '~/components/FourOhFour';
import LoadMoreButtonProgressBar from '~/components/LoadMoreButtonProgressBar';
import { PAGE_LIMIT } from '~/shared/constants';
import PromotionBannerWithTitle, { links as PageTitleLinks } from '~/components/PageTitle/PromotionBannerWithTitle';
import ProductRowsContainer, { links as ProductRowsContainerLinks } from '~/components/ProductRowsContainer';
import {
  getCanonicalDomain,
  getFourOhFourTitleText,
  getFourOhFourDescText,
  getCollectionTitleText,
  getPromotionDescText,
  getCategoryFBSEO_V2,
} from '~/utils/seo';

import { loadProducts, loadMoreProducts } from './loaders';
import type { LoadProductsDataType, LoadMoreDataType } from './types';
import reducer, { PromotionActionType } from './reducer';
import structuredData from './structured_data';

type LoaderType = 'load_products' | 'load_more_products';

export const handle = { structuredData };

export const links: LinksFunction = () => [
  ...AllTimeCouponLink(),
  ...ProductRowsContainerLinks(),
  ...PageTitleLinks(),
];

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
    categories = {},
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
  const navigation = useNavigation();

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

  const categoriesMap = categories || {};
  const isChangingPromotion =
    navigation.state !== 'idle' &&
    navigation.location &&
    categoriesMap.hasOwnProperty(decodeURI(navigation.location.pathname.substring(1)));

  const breadcrumbs = [
    {
      key: 'promotion_breadcrumbs_home',
      label: 'Home',
      to: '/',
      isCurrent: false,
    },
    {
      key: 'promotion_breadcrumbs_current',
      label: stateCategory?.title,
      to: `/promotion/${stateCategory?.name}`,
      isCurrent: true,
    },
  ];

  return (
    <>
      <div className="w-full mb-2.5 md:pb-8">
        <AllTimeCoupon isFullLayout />
      </div>
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
                  {!isLast ? <span aria-hidden="true">/</span> : null}
                </li>
              );
            })}
          </ol>
        </nav>

        <PromotionBannerWithTitle
          title={stateCategory?.title}
          subtitle={stateCategory?.description}
          superSale={stateCategory?.name === 'super_deal'}
        />

        <ProductRowsContainer loading={isChangingPromotion} products={state.products} />

        <div className="mb-4">
          <LoadMoreButtonProgressBar
            loading={loadMoreFetcher.state !== 'idle'}
            current={state.current}
            total={state.total}
            onClickLoadMore={handleLoadMore}
          />
        </div>
      </div>
    </>
  );
}

export default Promotion;

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <FourOhFour />;
    }
  }

  return <FourOhFour />;
}

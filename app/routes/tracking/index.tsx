import type { MouseEvent } from 'react';
import type { LinksFunction, LoaderFunction, ActionFunction, V2_MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData, useFetcher, useCatch } from '@remix-run/react';
import httpStatus from 'http-status-codes';
import type { DynamicLinksFunction } from 'remix-utils';

import Header, { links as HeaderLinks } from '~/routes/components/Header';
import Footer, { links as FooterLinks } from '~/components/Footer';
import { composErrorResponse } from '~/utils/error';
import SearchBar, { links as SearchBarLinks } from '~/components/SearchBar';
import { getCanonicalDomain, getTrackingTitleText, getTrackingFBSEO } from '~/utils/seo';
import CategoriesNav, { links as CategoriesNavLinks } from '~/components/Header/components/CategoriesNav';
import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';
import type { Category } from '~/shared/types';

import TrackingOrderInfo, { links as TrckingOrderInfoLinks } from './components/TrackingOrderInfo';
import TrackingSearchBar from './components/TrackingSearchBar';
import TrackingOrderErrorPage, { links as TrackingOrderErrorPageLinks } from './components/TrackingOrderErrorPage';
import TrackingOrderInitPage, { links as TrackingOrderInitPageLinks } from './components/TrackingOrderInitPage';
import { trackOrder } from './api.server';
import { normalizeTrackingOrder } from './utils';
import type { TrackOrder } from './types';

type LoaderDataType = {
  query: string;
  order: TrackOrder | null;
  canonicalLink: string;
  categories: Category[];
  navBarCategories: Category[];
};

type CatchBoundaryDataType = {
  query: string;
  errMessage: string;
  canonicalLink: string;
  categories: Category[];
  navBarCategories: Category[];
}

const dynamicLinks: DynamicLinksFunction<LoaderDataType> = ({ data }) => {
  return [
    {
      rel: 'canonical', href: `${getCanonicalDomain()}/tracking`,
    },
  ];
}
export const handle = { dynamicLinks };

export const meta: V2_MetaFunction = () => ([
  ...getTrackingFBSEO(),
  { title: getTrackingTitleText(), },
]);

export const links: LinksFunction = () => {
  return [
    ...FooterLinks(),
    ...HeaderLinks(),
    ...TrackingOrderErrorPageLinks(),
    ...TrackingOrderInitPageLinks(),
    ...SearchBarLinks(),
    ...CategoriesNavLinks(),
    ...TrckingOrderInfoLinks(),
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const [navBarCategories, categories] = await fetchCategoriesWithSplitAndHotDealInPlaced();
  const url = new URL(request.url);

  // Current route has just been requested. Ask user to search order by order ID.
  if (!url.searchParams.has('query')) {
    return json<LoaderDataType>({
      query: '',
      order: null,
      canonicalLink: `${getCanonicalDomain()}/tracking`,
      categories,
      navBarCategories,
    });
  }

  const query = url.searchParams.get('query') || '';

  // Order id is likely to be empty, thus, is invalid.
  if (!query) {
    return json(composErrorResponse('invalid order id'), httpStatus.BAD_REQUEST);
  }

  try {
    const order = normalizeTrackingOrder(await trackOrder(query));

    return json<LoaderDataType>({
      query,
      order,
      canonicalLink: `${getCanonicalDomain()}/tracking`,
      navBarCategories,
      categories,
    });
  } catch (err) {
    throw json<CatchBoundaryDataType>({
      query: '',
      errMessage: `Result for order ${query} is not found`,
      canonicalLink: `${getCanonicalDomain()}/tracking`,
      navBarCategories,
      categories,
    }, httpStatus.NOT_FOUND);
  }
}

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const orderUUID = body.get('query') as string || '';
  if (!orderUUID) {
    return redirect('/tracking');
  }
  return redirect(`/tracking?query=${orderUUID}`);
}

export const CatchBoundary = () => {
  const caught = useCatch();
  const caughtData: CatchBoundaryDataType = caught.data;
  const trackOrderFetcher = useFetcher();

  const handleOnSearch = (newOrderNum: string, evt: MouseEvent<HTMLSpanElement>) => {
    evt.preventDefault();

    trackOrderFetcher.submit(
      { query: newOrderNum },
      {
        method: 'post',
        action: '/tracking?index',
      },
    );
  }
  const handleOnClear = () => {
    trackOrderFetcher.submit(
      { query: '' },
      {
        method: 'post',
        action: '/tracking?index',
      },
    );
  }

  return (
    <>
      <Header
        categories={caughtData.categories}
        categoriesBar={
          <CategoriesNav
            categories={caughtData.categories}
            topCategories={caughtData.navBarCategories}
          />
        }
        searchBar={
          <SearchBar
            onSearch={handleOnSearch}
            onClear={handleOnClear}
            placeholder='Search by order id'
          />
        }
      />

      <Form action='/tracking'>
        <TrackingSearchBar
          onSearch={handleOnSearch}
          onClear={handleOnClear}
        />
      </Form>

      <TrackingOrderErrorPage message={caughtData.errMessage} />

      <Footer />
    </>
  )
}

function TrackingOrder() {
  const {
    query,
    order,
    categories,
    navBarCategories
  } = useLoaderData<LoaderDataType>() || {};
  const trackOrderFetcher = useFetcher();

  const handleOnSearch = (newOrderNum: string, evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    trackOrderFetcher.submit(
      { query: newOrderNum },
      {
        method: 'post',
        action: '/tracking?index',
      },
    );
  }

  const handleOnClear = () => {
    trackOrderFetcher.submit(
      { query: '' },
      {
        method: 'post',
        action: '/tracking?index',
      },
    );
  }


  return (
    <>
      <Header
        categories={categories}
        searchBar={<div />}
        categoriesBar={
          <CategoriesNav
            categories={categories}
            topCategories={navBarCategories}
          />
        }
      />

      <main>
        <Form action='/tracking'>
          {/* order search form */}
          <TrackingSearchBar
            query={query}
            onSearch={handleOnSearch}
            onClear={handleOnClear}
          />
        </Form>
        {
          order
            ? <TrackingOrderInfo orderInfo={order} />
            : <TrackingOrderInitPage />
        }
      </main>

      <Footer categories={categories} />
    </>
  );
}

export default TrackingOrder;


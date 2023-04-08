import type { MouseEvent } from 'react';
import type { LinksFunction, LoaderFunction, ActionFunction, MetaFunction } from '@remix-run/node';
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

import TrackingOrderInfo from './components/TrackingOrderInfo';
import TrackingSearchBar from './components/TrackingSearchBar';
import TrackingOrderErrorPage, { links as TrackingOrderErrorPageLinks } from './components/TrackingOrderErrorPage';
import TrackingOrderInitPage, { links as TrackingOrderInitPageLinks } from './components/TrackingOrderInitPage';
import { trackOrder } from './api.server';
import { normalizeTrackingOrder } from './utils';
import type { TrackOrder } from './types';

type LoaderDataType = {
  order: TrackOrder | null
  canonicalLink: string;
  categories: Category[];
  navBarCategories: Category[];
};

type CatchBoundaryDataType = {
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

export const meta: MetaFunction = () => ({
  title: getTrackingTitleText(),

  ...getTrackingFBSEO(),
})

export const links: LinksFunction = () => {
  return [
    ...FooterLinks(),
    ...HeaderLinks(),
    ...TrackingOrderErrorPageLinks(),
    ...TrackingOrderInitPageLinks(),
    ...SearchBarLinks(),
    ...CategoriesNavLinks(),
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const [navBarCategories, categories] = await fetchCategoriesWithSplitAndHotDealInPlaced();
  const url = new URL(request.url);

  // Current route has just been requested. Ask user to search order by order ID.
  if (!url.searchParams.has('query')) {
    return json<LoaderDataType>({
      order: null,
      canonicalLink: `${getCanonicalDomain()}/tracking`,
      categories,
      navBarCategories,
    });
  }

  const orderID = url.searchParams.get('query') || '';

  // Order id is likely to be empty, thus, is invalid.
  if (!orderID) {
    return json(composErrorResponse('invalid order id'), httpStatus.BAD_REQUEST);
  }

  try {
    const order = normalizeTrackingOrder(await trackOrder(orderID));

    return json<LoaderDataType>({
      order,
      canonicalLink: `${getCanonicalDomain()}/tracking`,
      navBarCategories,
      categories,
    });
  } catch (err) {
    throw json<CatchBoundaryDataType>({
      errMessage: `Result for order ${orderID} is not found`,
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
  const { order, categories, navBarCategories } = useLoaderData<LoaderDataType>() || {};
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


import type { MouseEvent } from 'react';
import { useState } from 'react';
import type { LinksFunction, LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from 'react-router';
import { redirect, useRouteError, isRouteErrorResponse } from 'react-router';
import { Form, useLoaderData, useFetcher } from 'react-router';
import httpStatus from 'http-status-codes';

import Header, { links as HeaderLinks } from '~/routes/Header/route';
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
import MobileSearchDialog from '~/components/MobileSearchDialog';

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

export const meta: MetaFunction<typeof loader> = ({ data }) => ([
  ...getTrackingFBSEO(),
  { title: getTrackingTitleText() },
  {
    tagName: 'link',
    rel: 'canonical',
    href: data?.canonicalLink || `${getCanonicalDomain()}/tracking`,
  },
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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const [navBarCategories, categories] = await fetchCategoriesWithSplitAndHotDealInPlaced();
  const url = new URL(request.url);

  // Current route has just been requested. Ask user to search order by order ID.
  if (!url.searchParams.has('query')) {
    return Response.json({
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
    return Response.json(
      composErrorResponse('invalid order id'), {
      status: httpStatus.BAD_REQUEST,
    });
  }

  try {
    const order = normalizeTrackingOrder(await trackOrder(query));

    return Response.json({
      query,
      order,
      canonicalLink: `${getCanonicalDomain()}/tracking`,
      navBarCategories,
      categories,
    });
  } catch (err) {
    throw Response.json({
      query: '',
      errMessage: `Result for order ${query} is not found`,
      canonicalLink: `${getCanonicalDomain()}/tracking`,
      navBarCategories,
      categories,
    }, {
      status: httpStatus.NOT_FOUND,
    });
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const orderUUID = body.get('query') as string || '';
  if (!orderUUID) {
    return redirect('/tracking');
  }
  return redirect(`/tracking?query=${orderUUID}`);
}

export function ErrorBoundary() {
  const error = useRouteError();
  const trackOrderFetcher = useFetcher();
  const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false);
  const handleOpen = () => setOpenSearchDialog(true);
  const handleClose = () => setOpenSearchDialog(false);

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

  if (isRouteErrorResponse(error)) {
    const caughtData: CatchBoundaryDataType = error.data;

    return (
      <>
        <MobileSearchDialog
          onBack={handleClose}
          isOpen={openSearchDialog}
        />

        <Header
          categories={caughtData.categories}
          categoriesBar={
            <CategoriesNav
              categories={caughtData.categories}
              topCategories={caughtData.navBarCategories}
            />
          }
          mobileSearchBar={
            <SearchBar
              placeholder='Search keywords...'
              onClick={handleOpen}
              onTouchEnd={handleOpen}
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

  // Handle unexpected errors
  return (
    <div>
      <h1>Unexpected Error</h1>
      <p>{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
    </div>
  );
}

function TrackingOrder() {
  const {
    query,
    order,
    categories,
    navBarCategories
  } = useLoaderData<LoaderDataType>() || {};
  const trackOrderFetcher = useFetcher();

  const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false);
  const handleOpen = () => setOpenSearchDialog(true);
  const handleClose = () => setOpenSearchDialog(false);

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
      <MobileSearchDialog
        onBack={handleClose}
        isOpen={openSearchDialog}
      />

      <Header
        categories={categories}
        categoriesBar={
          <CategoriesNav
            categories={categories}
            topCategories={navBarCategories}
          />
        }
        mobileSearchBar={
          <SearchBar
            placeholder='Search keywords...'
            onClick={handleOpen}
            onTouchEnd={handleOpen}
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


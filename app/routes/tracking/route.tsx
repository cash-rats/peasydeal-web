import type { MouseEvent } from 'react';
import { useState } from 'react';
import type { LinksFunction, LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from 'react-router';
import {
  redirect,
  useRouteError,
  isRouteErrorResponse,
  Form,
  useLoaderData,
  useFetcher,
  useRouteLoaderData,
} from 'react-router';
import httpStatus from 'http-status-codes';

import Header from '~/components/Header';
import Footer from '~/components/Footer';
import { composErrorResponse } from '~/utils/error';
import SearchBar, { links as SearchBarLinks } from '~/components/SearchBar';
import { getCanonicalDomain, getTrackingTitleText, getTrackingFBSEO } from '~/utils/seo';
import CategoriesNav from '~/components/Header/components/CategoriesNav';

import TrackingOrderInfo, { links as TrckingOrderInfoLinks } from '~/routes/tracking/components/TrackingOrderInfo';
import TrackingSearchBar from '~/routes/tracking/components/TrackingSearchBar';
import TrackingOrderErrorPage, { links as TrackingOrderErrorPageLinks } from '~/routes/tracking/components/TrackingOrderErrorPage';
import TrackingOrderInitPage, { links as TrackingOrderInitPageLinks } from '~/routes/tracking/components/TrackingOrderInitPage';
import { trackOrder } from '~/routes/tracking/api.server';
import { normalizeTrackingOrder } from '~/routes/tracking/utils';
import type { TrackOrder } from '~/routes/tracking/types';
import MobileSearchDialog from '~/components/MobileSearchDialog';
import type { RootLoaderData } from '~/root';

type LoaderDataType = {
  query: string;
  order: TrackOrder | null;
  canonicalLink: string;
};

type CatchBoundaryDataType = {
  query: string;
  errMessage: string;
  canonicalLink: string;
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
    ...TrackingOrderErrorPageLinks(),
    ...TrackingOrderInitPageLinks(),
    ...SearchBarLinks(),
    ...TrckingOrderInfoLinks(),
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  // Current route has just been requested. Ask user to search order by order ID.
  if (!url.searchParams.has('query')) {
    return Response.json({
      query: '',
      order: null,
      canonicalLink: `${getCanonicalDomain()}/tracking`,
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
    });
  } catch (err) {
    throw Response.json({
      query: '',
      errMessage: `Result for order ${query} is not found`,
      canonicalLink: `${getCanonicalDomain()}/tracking`,
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
  const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
  const cartCount = rootData?.cartCount || 0;
  const categories = rootData?.categories ?? [];
  const navBarCategories = rootData?.navBarCategories ?? [];
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
        action: '/tracking',
      },
    );
  }
  const handleOnClear = () => {
    trackOrderFetcher.submit(
      { query: '' },
      {
        method: 'post',
        action: '/tracking',
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
          categories={categories}
          numOfItemsInCart={cartCount}
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
  } = useLoaderData<LoaderDataType>() || {};
  const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
  const cartCount = rootData?.cartCount || 0;
  const categories = rootData?.categories ?? [];
  const navBarCategories = rootData?.navBarCategories ?? [];
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
        action: '/tracking',
      },
    );
  }

  const handleOnClear = () => {
    trackOrderFetcher.submit(
      { query: '' },
      {
        method: 'post',
        action: '/tracking',
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
        numOfItemsInCart={cartCount}
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
      />

      <main className='bg-gray-50'>
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

import type { LinksFunction, LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from 'react-router';
import {
  redirect,
  useRouteError,
  isRouteErrorResponse,
  useLoaderData,
  useFetcher,
  useRouteLoaderData,
} from 'react-router';
import httpStatus from 'http-status-codes';

import { composErrorResponse } from '~/utils/error';
import { getCanonicalDomain, getTrackingTitleText, getTrackingFBSEO } from '~/utils/seo';
import type { RootLoaderData } from '~/root';
import { V2Layout } from '~/components/v2/GlobalLayout';

import {
  TrackingSearch,
  TrackingError,
} from '~/components/v2/Tracking';
import TrackingOrderInfo, { links as TrackingOrderInfoLinks } from '~/routes/tracking/components/TrackingOrderInfo';

import { trackOrder } from '~/routes/tracking/api.server';
import { normalizeTrackingOrder } from '~/routes/tracking/utils';
import type { TrackOrder } from '~/routes/tracking/types';

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
    ...TrackingOrderInfoLinks(),
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (!url.searchParams.has('query')) {
    return Response.json({
      query: '',
      order: null,
      canonicalLink: `${getCanonicalDomain()}/tracking`,
    });
  }

  const query = url.searchParams.get('query') || '';

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
  const categories = rootData?.categories ?? [];
  const navBarCategories = rootData?.navBarCategories ?? [];
  const trackOrderFetcher = useFetcher();

  const handleSearch = (orderId: string) => {
    trackOrderFetcher.submit(
      { query: orderId },
      { method: 'post', action: '/tracking' },
    );
  };

  if (isRouteErrorResponse(error)) {
    const caughtData: CatchBoundaryDataType = error.data;

    return (
      <V2Layout categories={categories} navBarCategories={navBarCategories}>
        <TrackingSearch
          onSearch={handleSearch}
          isLoading={trackOrderFetcher.state !== 'idle'}
        />
        <TrackingError message={caughtData.errMessage} />
      </V2Layout>
    );
  }

  return (
    <div className="v2 max-w-[var(--container-max)] mx-auto px-[var(--container-padding)] py-20 text-center">
      <h1 className="font-heading text-2xl font-bold">Unexpected Error</h1>
      <p className="mt-4 text-rd-text-body">
        {error instanceof Error ? error.message : 'Unknown error occurred'}
      </p>
    </div>
  );
}

function TrackingOrder() {
  const {
    query,
    order,
  } = useLoaderData<LoaderDataType>() || {};

  const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
  const categories = rootData?.categories ?? [];
  const navBarCategories = rootData?.navBarCategories ?? [];

  const trackOrderFetcher = useFetcher();

  const handleSearch = (orderId: string) => {
    trackOrderFetcher.submit(
      { query: orderId },
      { method: 'post', action: '/tracking' },
    );
  };

  return (
    <V2Layout categories={categories} navBarCategories={navBarCategories}>
      <TrackingSearch
        initialQuery={query}
        onSearch={handleSearch}
        isLoading={trackOrderFetcher.state !== 'idle'}
      />

      {!order ? null : (
        <TrackingOrderInfo orderInfo={order} />
      )}
    </V2Layout>
  );
}

export default TrackingOrder;

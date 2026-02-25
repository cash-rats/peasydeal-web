import { useState, useEffect, useCallback } from 'react';
import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from 'react-router';
import {
  redirect,
  useRouteError,
  isRouteErrorResponse,
  useLoaderData,
  useFetcher,
  useRouteLoaderData,
  useRevalidator,
} from 'react-router';
import httpStatus from 'http-status-codes';
import parseISO from 'date-fns/parseISO';

import { composErrorResponse } from '~/utils/error';
import { getCanonicalDomain, getTrackingTitleText, getTrackingFBSEO } from '~/utils/seo';
import type { RootLoaderData } from '~/root';
import { V2Layout } from '~/components/v2/GlobalLayout';

import {
  TrackingSearch,
  OrderHeader,
  AlertBanner,
  ProductList,
  DeliveryInfo,
  TrackingOrderSummary,
  TrackingError,
  CancelOrderModal,
  ReviewModal,
} from '~/components/v2/Tracking';
import { Button } from '~/components/v2/Button/Button';

import { trackOrder } from '~/routes/tracking/api.server';
import { normalizeTrackingOrder } from '~/routes/tracking/utils';
import type { TrackOrder, TrackOrderProduct } from '~/routes/tracking/types';
import { OrderStatus } from '~/routes/tracking/types';

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

const parseTrackOrderCreatedAt = (order: TrackOrder): TrackOrder => ({
  ...order,
  parsed_created_at: parseISO(order.created_at),
});

function TrackingOrder() {
  const {
    query,
    order: rawOrder,
  } = useLoaderData<LoaderDataType>() || {};

  const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
  const categories = rootData?.categories ?? [];
  const navBarCategories = rootData?.navBarCategories ?? [];

  const trackOrderFetcher = useFetcher();
  const cancelFetcher = useFetcher();
  const revalidator = useRevalidator();

  // Order state
  const [order, setOrder] = useState<TrackOrder | null>(
    rawOrder ? parseTrackOrderCreatedAt(rawOrder) : null
  );
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // Review state
  const [reviewProduct, setReviewProduct] = useState<TrackOrderProduct | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // Sync order from loader
  useEffect(() => {
    if (rawOrder) {
      setOrder(parseTrackOrderCreatedAt(rawOrder));
    } else {
      setOrder(null);
    }
  }, [rawOrder]);

  // Handle cancel fetcher completion
  useEffect(() => {
    if (cancelFetcher.state === 'idle' && cancelFetcher.data !== undefined) {
      const errMsg = cancelFetcher.data;

      if (errMsg !== null) {
        setCancelError(typeof errMsg === 'string' ? errMsg : 'Failed to cancel order');
        return;
      }

      setCancelModalOpen(false);
      setOrder((prev) =>
        prev ? { ...prev, order_status: OrderStatus.Cancelled } : null
      );
      window?.scrollTo(0, 0);
    }
  }, [cancelFetcher.state, cancelFetcher.data]);

  const handleSearch = (orderId: string) => {
    trackOrderFetcher.submit(
      { query: orderId },
      { method: 'post', action: '/tracking' },
    );
  };

  const handleCancelConfirm = useCallback((reason: string) => {
    if (!order) return;
    setCancelError(null);

    cancelFetcher.submit(
      {
        order_uuid: order.order_uuid,
        cancel_reason: reason,
      },
      {
        method: 'post',
        action: '/api/tracking/order-info',
      },
    );
  }, [order]);

  const handleReviewSubmit = useCallback(async (data: {
    name: string;
    rating: number;
    review: string;
    images: File[];
    productUUID: string;
    orderUUID: string;
  }) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('rating', data.rating.toString());
    formData.append('review', data.review);
    formData.append('product_uuid', data.productUUID);
    formData.append('order_uuid', data.orderUUID);
    data.images.forEach((img) => formData.append('images', img));

    const resp = await fetch(
      '/api/tracking/order-info/review',
      { method: 'POST', body: formData },
    );

    if (!resp.ok) {
      throw new Error('Failed to submit review');
    }

    revalidator.revalidate();
  }, []);

  const handleReviewClose = () => {
    setReviewModalOpen(false);
    setReviewProduct(null);
  };

  const handleReviewClick = (product: TrackOrderProduct) => {
    setReviewProduct(product);
    setReviewModalOpen(true);
  };

  return (
    <V2Layout categories={categories} navBarCategories={navBarCategories}>
      <TrackingSearch
        initialQuery={query}
        onSearch={handleSearch}
        isLoading={trackOrderFetcher.state !== 'idle'}
      />

      {!order ? null : (
        <div className="max-w-[var(--container-max)] mx-auto px-[var(--container-padding)] pb-16">
          <OrderHeader order={order} />

          {cancelError && (
            <AlertBanner variant="error">
              Error cancelling order. {cancelError}{' '}
              <a
                href={`mailto:contact@peasydeal.com?subject=Cancelled Order - ${order.order_uuid}`}
                className="underline"
              >
                Contact us
              </a>
            </AlertBanner>
          )}

          {order.order_status === OrderStatus.Cancelled && (
            <AlertBanner variant="info">
              This order has been cancelled. If payment was made, it will be refunded.
            </AlertBanner>
          )}

          <ProductList
            products={order.products}
            onReview={handleReviewClick}
          />

          <DeliveryInfo order={order} />

          <TrackingOrderSummary order={order} />

          {order.order_status !== OrderStatus.Cancelled && (
            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={() => setCancelModalOpen(true)}
                className="!text-[#C75050] !border-[#C75050] hover:!bg-[#FEF2F2]"
              >
                Cancel Order
              </Button>
            </div>
          )}

          <CancelOrderModal
            open={cancelModalOpen}
            onClose={() => setCancelModalOpen(false)}
            onConfirm={handleCancelConfirm}
            isLoading={cancelFetcher.state !== 'idle'}
          />

          <ReviewModal
            open={reviewModalOpen}
            onClose={handleReviewClose}
            product={reviewProduct}
            orderUUID={order.order_uuid}
            onSubmit={handleReviewSubmit}
          />
        </div>
      )}
    </V2Layout>
  );
}

export default TrackingOrder;

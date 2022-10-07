import type { MouseEvent } from 'react';
import type { LinksFunction, LoaderFunction, ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData, useFetcher, useCatch } from '@remix-run/react';
import httpStatus from 'http-status-codes';

import TrackOrderHeader, { links as TrackOrderHeaderLinks } from '~/components/Header/components/TrackOrderHeader';
import Footer, { links as FooterLinks } from '~/components/Footer';
import { error } from '~/utils/error';

import TrackingOrderInfo, { links as TrackingOrderInfoLinks } from './components/TrackingOrderInfo';
import TrackingOrderErrorPage, { links as TrackingOrderErrorPageLinks } from './components/TrackingOrderErrorPage';
import TrackingOrderInitPage, { links as TrackingOrderInitPageLinks } from './components/TrackingOrderInitPage';
import { trackOrder } from './api';
import type { TrackOrder } from './types';

type LoaderDataType = { order: TrackOrder | null };

export const links: LinksFunction = () => {
  return [
    ...FooterLinks(),
    ...TrackOrderHeaderLinks(),
    ...TrackingOrderInfoLinks(),
    ...TrackingOrderErrorPageLinks(),
    ...TrackingOrderInitPageLinks(),
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  // Current route has just been requested. Ask user to search order by order ID.
  if (!url.searchParams.has('query')) {
    return json<LoaderDataType>({ order: null }, httpStatus.OK)
  }

  const orderID = url.searchParams.get('query') || '';

  // Order id is likely to be empty, thus, is invalid.
  if (!orderID) {
    return json(error('invalid order id'), httpStatus.BAD_REQUEST);
  }

  const resp = await trackOrder(orderID);
  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    throw json(`Result for order ${orderID} is not found`, resp.status);
  }

  const orderInfo = respJSON as TrackOrder

  return json<LoaderDataType>({ order: orderInfo }, httpStatus.OK);
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
      <TrackOrderHeader
        onSearch={handleOnSearch}
        onClear={handleOnClear}
      />
      <TrackingOrderErrorPage message={caught.data} />

      <Footer />
    </>
  )
}


function TrackingOrder() {
  const { order } = useLoaderData<LoaderDataType>();
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
      <TrackOrderHeader
        onSearch={handleOnSearch}
        onClear={handleOnClear}
      />

      <main>
        {
          order
            ? <TrackingOrderInfo orderInfo={order} />
            : <TrackingOrderInitPage />
        }
      </main>

      <Footer />
    </>
  );
}

export default TrackingOrder;


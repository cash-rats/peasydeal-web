import type { MouseEvent } from 'react';
import type { LinksFunction, LoaderFunction, ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData, useFetcher, useCatch } from '@remix-run/react';
import httpStatus from 'http-status-codes';

import TrackOrderHeader, { links as TrackOrderHeaderLinks } from '~/components/TrackOrderHeader';
import Header, { links as HeaderLinks } from '~/components/Header';
import Footer, { links as FooterLinks } from '~/components/Footer';
import { error } from '~/utils/error';
import { getItemCount } from '~/utils/shoppingcart.session';
import SearchBar, { links as SearchBarLinks } from '~/components/SearchBar';

import TrackingOrderInfo, { links as TrackingOrderInfoLinks } from './components/TrackingOrderInfo';
import TrackingOrderErrorPage, { links as TrackingOrderErrorPageLinks } from './components/TrackingOrderErrorPage';
import TrackingOrderInitPage, { links as TrackingOrderInitPageLinks } from './components/TrackingOrderInitPage';
import { trackOrder } from './api';
import type { TrackOrder } from './types';

type LoaderDataType = {
  order: TrackOrder | null
  numOfItemsInCart: number;
};

export const links: LinksFunction = () => {
  return [
    ...FooterLinks(),

    ...HeaderLinks(),
    ...TrackOrderHeaderLinks(),

    ...TrackingOrderInfoLinks(),
    ...TrackingOrderErrorPageLinks(),
    ...TrackingOrderInitPageLinks(),
    ...SearchBarLinks(),
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const numOfItemsInCart = await getItemCount(request);

  const url = new URL(request.url);

  // Current route has just been requested. Ask user to search order by order ID.
  if (!url.searchParams.has('query')) {
    return json<LoaderDataType>({
      order: null,
      numOfItemsInCart,
    });
  }

  const orderID = url.searchParams.get('query') || '';

  // Order id is likely to be empty, thus, is invalid.
  if (!orderID) {
    return json(error('invalid order id'), httpStatus.BAD_REQUEST);
  }

  try {
    const order = await trackOrder(orderID)

    return json<LoaderDataType>({
      order,
      numOfItemsInCart,
    });
  } catch (err) {
    throw json(`Result for order ${orderID} is not found`, httpStatus.NOT_FOUND);
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
      <Form action='/tracking?index'>
        <Header
          searchBar={
            <SearchBar
              onSearch={handleOnSearch}
              onClear={handleOnClear}
              placeholder='Search by order id'
            />
          }
        />
      </Form>

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
      <Form action='/tracking?index'>
        <Header
          searchBar={
            <SearchBar
              onSearch={handleOnSearch}
              onClear={handleOnClear}
              placeholder='Search by order id'
            />
          }
        />
      </Form>

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


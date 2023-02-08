import { useState } from 'react';
import type { MouseEvent } from 'react';
import type { LinksFunction, LoaderFunction, ActionFunction, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useLoaderData, useFetcher, useCatch } from '@remix-run/react';
import httpStatus from 'http-status-codes';
import type { DynamicLinksFunction } from 'remix-utils';

import { breakPoints } from '~/styles/breakpoints';
import MqNotifier from '~/components/MqNotifier';
import Header, { links as HeaderLinks } from '~/components/Header';
import Footer, { links as FooterLinks } from '~/components/Footer';
import { error } from '~/utils/error';
import { getItemCount } from '~/sessions/shoppingcart.session';
import SearchBar, { links as SearchBarLinks } from '~/components/SearchBar';
import { getCanonicalDomain, getTrackingTitleText, getTrackingFBSEO } from '~/utils/seo';
import { fetchCategories } from '~/api';
import type { Category } from '~/shared/types';
import CategoryContext from '~/context/categories';

import TrackingOrderInfo from './components/TrackingOrderInfo';
import TrackingOrderErrorPage, { links as TrackingOrderErrorPageLinks } from './components/TrackingOrderErrorPage';
import TrackingOrderInitPage, { links as TrackingOrderInitPageLinks } from './components/TrackingOrderInitPage';
import { trackOrder } from './api';
import type { TrackOrder } from './types';

type LoaderDataType = {
  order: TrackOrder | null
  numOfItemsInCart: number;
  canonicalLink: string;
  categories: Category[];
};

type CatchBoundaryDataType = {
  errMessage: string;
  numOfItemsInCart: number;
  canonicalLink: string;
  categories: Category[];
}

const dynamicLinks: DynamicLinksFunction<LoaderDataType> = ({ data }) => {
  return [
    {
      rel: 'canonical', href: data.canonicalLink,
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
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const categories = await fetchCategories();
  const numOfItemsInCart = await getItemCount(request);
  const url = new URL(request.url);

  // Current route has just been requested. Ask user to search order by order ID.
  if (!url.searchParams.has('query')) {
    return json<LoaderDataType>({
      order: null,
      numOfItemsInCart,
      canonicalLink: `${getCanonicalDomain()}/tracking`,
      categories,
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
      canonicalLink: `${getCanonicalDomain()}/tracking`,
      categories,
    });
  } catch (err) {
    throw json<CatchBoundaryDataType>({
      errMessage: `Result for order ${orderID} is not found`,
      numOfItemsInCart,
      canonicalLink: `${getCanonicalDomain()}/tracking`,
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
  const [disableDesktopSearchBar, setDisableDesktopSearchBar] = useState(false);

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
    <MqNotifier mqValidators={[
      {
        condition: (dom) => dom.innerWidth < breakPoints.screen768min,
        callback: (dom) => {
          setDisableDesktopSearchBar(true)
        }
      },
      {
        condition: (dom) => dom.innerWidth >= breakPoints.screen768min,
        callback: (dom) => {
          setDisableDesktopSearchBar(false)
        }
      }
    ]}>
      <CategoryContext.Provider value={caughtData.categories}>
        <Form action='/tracking'>
          <Header
            headerType='order_search'
            numOfItemsInCart={caughtData.numOfItemsInCart}
            searchBar={
              <SearchBar
                disabled={disableDesktopSearchBar}
                onSearch={handleOnSearch}
                onClear={handleOnClear}
                placeholder='Search by order id'
              />
            }
          />
        </Form>
      </CategoryContext.Provider>

      <TrackingOrderErrorPage message={caughtData.errMessage} />

      <Footer />
    </MqNotifier>
  )
}


function TrackingOrder() {
  const { order, numOfItemsInCart, categories } = useLoaderData<LoaderDataType>();
  const trackOrderFetcher = useFetcher();
  const [disableDesktopSearchBar, setDisableDesktopSearchBar] = useState(false);


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
    <MqNotifier mqValidators={[
      {
        condition: (dom) => dom.innerWidth < breakPoints.screen768min,
        callback: (dom) => {
          setDisableDesktopSearchBar(true)
        }
      },
      {
        condition: (dom) => dom.innerWidth >= breakPoints.screen768min,
        callback: (dom) => {
          setDisableDesktopSearchBar(false)
        }
      }
    ]}>
      <CategoryContext.Provider value={categories}>
        <Form action='/tracking'>
          <Header
            headerType='order_search'
            numOfItemsInCart={numOfItemsInCart}
            mobileSearchBarPlaceholder='Search by order id...'
            searchBar={<div />}
          />
        </Form>
      </CategoryContext.Provider>

      <main>
        {/* order search form */}
        <div>
        </div>

        {
          order
            ? <TrackingOrderInfo orderInfo={order} />
            : <TrackingOrderInitPage />
        }
      </main>

      <Footer />
    </MqNotifier>
  );
}

export default TrackingOrder;


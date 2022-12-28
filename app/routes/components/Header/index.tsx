import { useEffect, useState } from 'react';
import { useFetcher, useFetchers } from '@remix-run/react';
import type { LinksFunction, LoaderFunction, ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

import Header, { links as HeaderLinks } from '~/components/Header';
import type { HeaderProps } from '~/components/Header';
import { getItemCount } from '~/sessions/shoppingcart.session';

export const links: LinksFunction = () => {
  return [
    ...HeaderLinks(),
  ];
};

type LoaderDataType = {
  numOfItemsInCart: number;
};

type ActionDataType = {
  numOfItemsInCart: number;
}

// Header compoent it's self would submit a GET request to this loader to reload `numOfItemsInCart`
export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderDataType>({ numOfItemsInCart: await getItemCount(request) });
}

// When other component wants to notify Header to reload `numOfItemsInCart`, they submit a POST request to this action.
// For example, if $prodID wants to reload item count, it would do:
//  fetcher.submit(null, { action: '/components/Header?index' });
export const action: ActionFunction = async ({ request }) => {
  return json<ActionDataType>({ numOfItemsInCart: await getItemCount(request) });
}

type HeaderRouteProps = Omit<HeaderProps, 'numOfItemsInCart'>

function HeaderRoute(props: HeaderRouteProps) {
  const [numOfItemsInCart, setNumOfItemsInCart] = useState(0);
  const fetcher = useFetcher();
  const fetchers = useFetchers();


  const addToCartFetcher = fetchers.find((f) => {
    return f.submission?.action.includes('/components/Header') && f.submission.method === 'POST';
  });

  useEffect(() => {
    fetcher.submit(null, { action: '/components/Header?index' });
  }, []);

  useEffect(() => {
    if (fetcher.type === 'done') {
      setNumOfItemsInCart(Number(fetcher.data.numOfItemsInCart));
    }
  }, [fetcher.type, numOfItemsInCart]);

  useEffect(() => {
    if (addToCartFetcher?.type === 'actionReload') {
      fetcher.submit(null, { action: '/components/Header?index' });
    }
  }, [addToCartFetcher?.type])

  return (<Header
    form={props.form}
    categoriesBar={props.categoriesBar}
    numOfItemsInCart={numOfItemsInCart}
    searchBar={props.searchBar}
    onSearch={props.onSearch}
  />
  );
}

export default HeaderRoute;
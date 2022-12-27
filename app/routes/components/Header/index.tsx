import { useEffect, useState } from 'react';
import { useFetcher, useLoaderData } from '@remix-run/react';
import type { LinksFunction, LoaderFunction } from '@remix-run/node';
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

export const loader: LoaderFunction = async ({ request }) => {
  const itemCount = await getItemCount(request)
  console.log('debug loader ~~~', itemCount);
  return json<LoaderDataType>({ numOfItemsInCart: itemCount });
}

type HeaderRouteProps = Omit<HeaderProps, 'numOfItemsInCart'>

function HeaderRoute(props: HeaderRouteProps) {
  const [numOfItemsInCart, setNumOfItemsInCart] = useState(0);
  const data = useLoaderData<LoaderDataType>();
  const fetcher = useFetcher();
  useEffect(() => {
    fetcher.submit(null, { action: '/components/Header?index' });
  }, []);

  useEffect(() => {
    if (fetcher.type === 'done') {
      console.log('debug 3', fetcher.data.numOfItemsInCart);
      setNumOfItemsInCart(Number(fetcher.data.numOfItemsInCart));
    }
  }, [fetcher.data]);

  useEffect(() => {
    console.log('debug heloo data', data);
  }, [data])

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
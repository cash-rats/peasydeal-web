import { useEffect, useState } from 'react';
import { useFetcher, useFetchers } from 'react-router';
import {
  type LinksFunction, LoaderFunction, ActionFunction,
  redirect
} from 'react-router';

import Header, { links as HeaderLinks } from '~/components/Header';
import type { HeaderProps } from '~/components/Header';
import { getItemCount } from '~/sessions/shoppingcart.session';

export const links: LinksFunction = () => {
  return [
    ...HeaderLinks(),
  ];
};

// Header compoent it's self would submit a GET request to this loader to reload `numOfItemsInCart`
export const loader: LoaderFunction = async ({ request }) => {
  return Response.json({ numOfItemsInCart: await getItemCount(request) });
}

export enum ActionTypes {
  reload_cart_count = 'reload_cart_count',

  // Being used by `/components/Header/components/CategoriesNav` for root category redirection.
  redirect_to_collection = 'redirect_to_collection',
};

/**
 * Action: reload_cart_count
 *  When other component wants to notify Header to reload `numOfItemsInCart`,
 *  they submit a POST request to this action.
 *  For example, if $prodID wants to reload item count, it would submit an action
 *  like:
 *
 *     fetcher.submit(null, { action: '/components/Header?index' });
 *
 *     or
 *
 *     fetcher.submit(
 *       { action_type: ActionTypes.reload_cart_count },
 *       { action: '/components/Header?index'
 *     });
 *
 *   Header route would find the corresponding submission via `fetchers` and reload the cart item count
 *   via submitting an action to it's own route (in this case /components/Header) .
 *
 * Action: redirect_to_collection
 *
 *  This action handles redirection from `/components/Header/components/CategoriesNav` `promotion` or `collection`.
 */

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const formObj = Object.fromEntries(form.entries());
  const formAction = formObj['action_type'] as ActionTypes;

  if (formAction === ActionTypes.redirect_to_collection) {
    const catType = formObj['category_type'];
    const catName = formObj['category_name'];

    return redirect(`/${catType}/${catName}`);
  }

  const itemCount = await getItemCount(request);
  return Response.json({ numOfItemsInCart: itemCount });
}

type HeaderRouteProps = Omit<HeaderProps, 'numOfItemsInCart'>

function HeaderRoute(props: HeaderRouteProps) {
  const [numOfItemsInCart, setNumOfItemsInCart] = useState(0);
  const fetcher = useFetcher();
  const fetchers = useFetchers();

  const reloadCartCountFetcher = fetchers.find(
    (f) =>
      f.formAction?.includes('/components/Header') &&
      f.formMethod === 'POST'
  );

  useEffect(() => {
    fetcher.submit(
      { action_type: ActionTypes.reload_cart_count, },
      { action: '/components/Header?index' },
    );
  }, []);

  useEffect(() => {
    if (
      reloadCartCountFetcher &&
      reloadCartCountFetcher.state === 'loading' &&
      reloadCartCountFetcher.data !== undefined &&
      reloadCartCountFetcher.formMethod === 'POST'
    ) {
      fetcher.submit(
        { action_type: ActionTypes.reload_cart_count },
        { action: '/components/Header?index' },
      );
    }
  }, [reloadCartCountFetcher?.state, reloadCartCountFetcher?.data, reloadCartCountFetcher?.formMethod])

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data !== undefined) {
      setNumOfItemsInCart(Number(fetcher.data.numOfItemsInCart));
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <Header
      {...props}
      numOfItemsInCart={numOfItemsInCart}
    />
  );
}

export default HeaderRoute;

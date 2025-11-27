import { Outlet, useLoaderData } from 'react-router';
import type { ActionFunctionArgs, LinksFunction, MetaFunction } from 'react-router';
import { useEffect } from 'react';
import httpStatus from 'http-status-codes';

import CatalogLayout, { links as CatalogLayoutLinks } from '~/components/layouts/CatalogLayout';
import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';
import type { Category } from '~/shared/types';
import { getPaymentSuccessTitleText } from '~/utils/seo';
import { useCartCount, useCartContext } from '~/routes/hooks';
import { fetchOrder } from '~/routes/payment/api.server';
import { getCookieSession } from '~/sessions/session_utils.server';
import {
  clearCheckoutSessionData,
  commitCheckoutSession,
} from '~/sessions/checkout.session.server';
import { sessionResetTransactionObject } from '~/sessions/transaction.session.server';

type LoaderData = {
  categories: Category[];
  navBarCategories: Category[];
};

export const links: LinksFunction = () => {
  return [
    ...CatalogLayoutLinks(),
  ];
};

export const meta: MetaFunction = () => ([
  { title: getPaymentSuccessTitleText() },
]);

export const loader = async () => {
  try {
    const [navBarCategories, categories] = await fetchCategoriesWithSplitAndHotDealInPlaced();

    return Response.json({
      categories,
      navBarCategories,
    });
  } catch (e) {
    console.error(e);

    throw Response.json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const orderUUID = url.searchParams.get('order_uuid');

  if (!orderUUID) {
    throw Error('no order id presented in query params');
  }

  let session = await getCookieSession(request);
  session = await sessionResetTransactionObject(clearCheckoutSessionData(session));

  return Response.json(
    await fetchOrder(orderUUID),
    {
      headers: {
        'Set-Cookie': await commitCheckoutSession(session),
      }
    }
  );
};

export default function Payment() {
  const { categories, navBarCategories } = useLoaderData<LoaderData>() || {};
  const cartCount = useCartCount();
  const { clearCart, isInitialized } = useCartContext();

  useEffect(() => {
    if (!isInitialized) return;
    clearCart()
      .catch((error) => {
        console.error('Failed to clear cart on payment route', error)
      });
  }, [clearCart, isInitialized]);

  return (
    <CatalogLayout
      categories={categories}
      navBarCategories={navBarCategories}
      cartCount={cartCount}
    >

      <div className="min-h-[35rem] flex justify-center">
        <Outlet />
      </div>

    </CatalogLayout>
  );
}

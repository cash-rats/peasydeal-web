import { Outlet, useRouteLoaderData } from 'react-router';
import type { ActionFunctionArgs, MetaFunction } from 'react-router';
import { useEffect } from 'react';

import { V2Layout } from '~/components/v2/GlobalLayout';
import { getPaymentSuccessTitleText } from '~/utils/seo';
import { useCartContext } from '~/routes/hooks';
import { fetchOrder } from '~/routes/payment/api.server';
import { getCookieSession } from '~/sessions/session_utils.server';
import {
  clearCheckoutSessionData,
  commitCheckoutSession,
} from '~/sessions/checkout.session.server';
import { sessionResetTransactionObject } from '~/sessions/transaction.session.server';
import type { RootLoaderData } from '~/root';


export const meta: MetaFunction = () => ([
  { title: getPaymentSuccessTitleText() },
]);

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
  const rootData = useRouteLoaderData('root') as RootLoaderData | undefined;
  const categories = rootData?.categories ?? [];
  const navBarCategories = rootData?.navBarCategories ?? [];
  const { clearCart, isInitialized } = useCartContext();

  useEffect(() => {
    if (!isInitialized) return;
    clearCart()
      .catch((error) => {
        console.error('Failed to clear cart on payment route', error)
      });
  }, [clearCart, isInitialized]);

  return (
    <V2Layout
      categories={categories}
      navBarCategories={navBarCategories}
    >

      <div className="min-h-[35rem] flex justify-center">
        <Outlet />
      </div>

    </V2Layout>
  );
}

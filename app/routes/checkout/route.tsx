import httpStatus from 'http-status-codes';

import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';
import { createPaymentIntent } from '~/services/stripe.server';
import { envs } from '~/utils/env';

import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from 'react-router';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const [navBarCategories, categories] =
      await fetchCategoriesWithSplitAndHotDealInPlaced();

    // TODO this number should be coming from BE instead.
    // https://stackoverflow.com/questions/45453090/stripe-throws-invalid-integer-error
    // In stripe, the base unit is 1 cent, not 1 dollar.
    // https://stackoverflow.com/questions/45453090/stripe-throws-invalid-integer-error
    // In stripe, the base unit is 1 cent, not 1 dollar.
    const paymentIntent = await createPaymentIntent({
      amount: Math.round(priceInfo.total_amount * 100),
      currency: envs.STRIPE_CURRENCY_CODE,
    });

    return Response.json({
      client_secret: paymentIntent.client_secret || undefined,
      payment_intend_id: paymentIntent.id,
      categories,
      navBarCategories,
      price_info: priceInfo,
      promo_code: promo_code,
    });
  } catch (e) {
    throw Response.json(e, {
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
};

// Minimal layout route for `/checkout` while debugging 500 errors.
export const meta: MetaFunction = () => [
  { title: 'Checkout (debug layout)' },
];

export const links: LinksFunction = () => {
  return [];
};

function CheckoutLayoutDebug() {
  return (
    <main className="min-h-[35rem] flex items-center justify-center">
      <h1 className="text-xl font-semibold">
        Hello from /checkout (layout debug)
      </h1>
    </main>
  );
}

// Temporary stub so `useContext` imports from this route still compile
// while the real checkout context is disabled for debugging.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useContext(): any {
  return {};
}

export default CheckoutLayoutDebug;


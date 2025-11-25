import type { Session } from 'react-router';

import type { PriceInfo } from '~/shared/cart';
import type { ShoppingCart } from '~/sessions/types';
import { commitSession, destroySession, getSession } from './sessions';

const CHECKOUT_SESSION_KEY = 'checkout:data';

export type CheckoutSessionData = {
  priceInfo: PriceInfo;
  promoCode: string | null;
  cart: ShoppingCart;
};

export const getCheckoutSession = async (request: Request) => {
  const session = await getSession(request.headers.get('Cookie'));
  const data = session.get(CHECKOUT_SESSION_KEY) as CheckoutSessionData | undefined;

  return {
    session,
    data: data ?? null,
  };
};

export const setCheckoutSessionData = (
  session: Session,
  data: CheckoutSessionData,
) => {
  session.set(CHECKOUT_SESSION_KEY, data);
};

export const clearCheckoutSessionData = (session: Session) => {
  session.set(CHECKOUT_SESSION_KEY, null);
};

export const commitCheckoutSession = (session: Session) => commitSession(session);

export const destroyCheckoutSession = (session: Session) => destroySession(session);

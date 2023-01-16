import type { Session } from '@remix-run/node';

import type { PriceInfo } from '~/shared/cart';

import { getCookieSession } from './session_utils';

export interface TransactionObject {
  promo_code?: string | null;
  price_info: PriceInfo;
}

export const TransactinoObjectSessionKey = 'transaction_object';

export const getTransactionObject = async (request: Request): Promise<TransactionObject | null> => {
  const session = await getCookieSession(request);
  if (!session.has(TransactinoObjectSessionKey)) return null;
  const transobj = session.get(TransactinoObjectSessionKey);
  return transobj;
}

export const resetTransactionObject = async (request: Request): Promise<Session> => {
  const session = await getCookieSession(request);
  return sessionResetTransactionObject(session);
}

export const sessionResetTransactionObject = async (session: Session): Promise<Session> => {
  session.set(TransactinoObjectSessionKey, null)
  return session;
}

export const setTransactionObject = async (request: Request, transactionObj: TransactionObject): Promise<Session> => {
  const session = await getCookieSession(request);
  return sessionSetTransactionObject(session, transactionObj);
}

export const sessionSetTransactionObject = async (session: Session, transactionObj: TransactionObject): Promise<Session> => {
  session.set(TransactinoObjectSessionKey, transactionObj);
  return session
}
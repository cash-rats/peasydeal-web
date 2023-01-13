import type { Session } from '@remix-run/node';

import { getCookieSession } from './session_utils';

export type PriceInfo = {
  sub_total: number;
  tax_amount: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  vat_included: boolean;
  discount_code_valid: boolean;
  discount_type: 'free_shipping' | 'price_off' | 'percentage_off';
}

export interface TransactionObject {
  promo_code?: string | null;
  price_info: PriceInfo;
}

export const TransactinoObjectSessionKey = 'transaction_object';

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
  session.set(TransactinoObjectSessionKey, transactionObj);
  return session;
}

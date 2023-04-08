import httpStatus from 'http-status-codes';

import type { ApiErrorResponse } from '~/shared/types';

import type { SuccessOrderDetail } from './types';

export const fetchOrder = async (orderUUID: string): Promise<SuccessOrderDetail> => {
  const { PEASY_DEAL_ENDPOINT } = process.env

  const resp = await fetch(`${PEASY_DEAL_ENDPOINT}/v1/orders?order_uuid=${orderUUID}`, {
    method: 'GET',
  })
  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    const errResp = respJSON as ApiErrorResponse;
    throw new Error(errResp.err_msg);
  }

  return respJSON as SuccessOrderDetail;
}
import httpStatus from 'http-status-codes';

import type { ApiErrorResponse } from '~/shared/types';
import { envs } from '~/utils/get_env_source';

import type { SuccessOrderDetail } from './types';

export const fetchOrder = async (orderUUID: string): Promise<SuccessOrderDetail> => {
  const url = new URL(envs.PEASY_DEAL_ENDPOINT);
  url.pathname = '/v2/orders';
  url.searchParams.set('order_uuid', orderUUID);

  const resp = await fetch(url.toString(), {
    method: 'GET',
  })
  const respJSON = await resp.json();
  if (resp.status !== httpStatus.OK) {
    const errResp = respJSON as ApiErrorResponse;
    throw new Error(errResp.err_msg);
  }

  return respJSON as SuccessOrderDetail;
}
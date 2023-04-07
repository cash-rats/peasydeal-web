import httpStatus from 'http-status-codes';

import type { ApiErrorResponse } from '~/shared/types';
import { PEASY_DEAL_ENDPOINT } from '~/utils/get_env_source';

import type { TrackOrder } from './types';

export const trackOrder = async (orderUUID: string): Promise<TrackOrder> => {
  const url = new URL(PEASY_DEAL_ENDPOINT);
  url.pathname = '/v1/tracking';
  url.searchParams.append('order_uuid', orderUUID);

  const resp = await fetch(url.toString(), {
    method: 'GET',
  });

  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    const errResp = respJSON as ApiErrorResponse;
    throw new Error(errResp.err_msg);
  }

  return respJSON as TrackOrder;
}
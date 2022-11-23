import httpStatus from 'http-status-codes';

import type { ApiErrorResponse } from '~/shared/types';

import type { TrackOrder } from './types';

export const trackOrder = async (orderUUID: string): Promise<TrackOrder> => {
  const { PEASY_DEAL_ENDPOINT } = process.env
  const resp = await fetch(`${PEASY_DEAL_ENDPOINT}/v1/tracking?order_uuid=${orderUUID}`, {
    method: 'GET',
  });

  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    const errResp = respJSON as ApiErrorResponse;
    throw new Error(errResp.err_message);
  }

  return respJSON as TrackOrder;
}
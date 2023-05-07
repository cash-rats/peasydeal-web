import httpStatus from 'http-status-codes';

import type { ApiErrorResponse } from '~/shared/types';
import { PEASY_DEAL_ENDPOINT } from '~/utils/get_env_source';

export const subscribe = async (email: string): Promise<object> => {
  const url = new URL(PEASY_DEAL_ENDPOINT);
  url.pathname = '/v1/subscribe';

  const resp = await fetch(url.toString(), {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  const respJson = await resp.json();

  if (resp.status !== httpStatus.OK) {
    throw new Error(JSON.stringify(respJson as ApiErrorResponse))
  }

  return respJson
}
import httpStatus from 'http-status-codes';

import { envs } from '~/utils/get_env_source';
import type { ApiErrorResponse } from '~/shared/types';

export const activateEmailSubscribe = async (uuid: string): Promise<string> => {
  const url = new URL(envs.PEASY_DEAL_ENDPOINT);
  url.pathname = '/v1/subscribe/activate-email';

  const resp = await fetch(
    url.toString(),
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uuid })
    });

  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    throw new Error(JSON.stringify(respJSON as ApiErrorResponse));
  }

  return respJSON.coupon as string;
};
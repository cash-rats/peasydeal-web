import httpStatus from 'http-status-codes';

import { envs } from '~/utils/env';

export const subscribe = async (email: string): Promise<object> => {
  const url = new URL(envs.PEASY_DEAL_ENDPOINT);
  url.pathname = '/v2/subscribe';

  const resp = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  const respJson = await resp.json();

  if (resp.status !== httpStatus.OK) {
    throw new Error(JSON.stringify(respJson));
  }

  return respJson
}
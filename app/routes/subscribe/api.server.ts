import httpStatus from 'http-status-codes';

import { envs } from '~/utils/get_env_source';

export const subscribe = async (email: string): Promise<object> => {
  const url = new URL(envs.PEASY_DEAL_ENDPOINT);
  url.pathname = '/v1/subscribe';

  const resp = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  const respJson = await resp.json();

  if (resp.status !== httpStatus.OK) {
    return {
      ...respJson,
      status: resp.status,
    }
  }

  return respJson
}
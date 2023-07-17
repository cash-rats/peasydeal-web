import httpStatus from 'http-status-codes';

import type { ApiErrorResponse } from '~/shared/types';
import { PEASY_DEAL_ENDPOINT } from '~/utils/get_env_source';

export const fetchReviews = async (productUUID: string) => {
  const url = new URL(PEASY_DEAL_ENDPOINT);
  url.pathname = `/v1/products/${productUUID}/reviews`;

  const resp = await fetch(url.toString(), {
    method: 'GET',
  })

  const respJSON = await resp.json();
  console.log('debug 1', respJSON);
};

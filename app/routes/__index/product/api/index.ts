import httpStatus from 'http-status-codes';

import { PEASY_DEAL_ENDPOINT } from '~/utils/get_env_source';
import type { ProductDetail } from '../types';

export const fetchProductDetail = async (prodId: string): Promise<ProductDetail> => {
  const resp = await fetch(`${PEASY_DEAL_ENDPOINT}/v1/products/${prodId}`);
  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    throw new Error(JSON.stringify(respJSON));
  }

  return respJSON;
}

import httpStatus from 'http-status-codes';

import { getPeasyDealEndpoint } from '~/utils/endpoints';
import type { ProductDetail } from '../types';

export const fetchProductDetail = async (prodId: string): Promise<ProductDetail> => {
  const resp = await fetch(`${getPeasyDealEndpoint()}/v1/products/${prodId}`);
  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    throw new Error(JSON.stringify(respJSON));
  }

  return respJSON;
}

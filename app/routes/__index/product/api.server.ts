
import httpStatus from 'http-status-codes';

import { envs } from '~/utils/get_env_source';
import type { ApiErrorResponse } from '~/shared/types';

import type { ProductDetail } from './types';
import { pickMainImage } from '../utils';

export const fetchProductDetail = async (prodId: string): Promise<ProductDetail> => {
  const url = new URL(envs.PEASY_DEAL_ENDPOINT);
  url.pathname = `/v1/products/${prodId}`;

  const resp = await fetch(url.toString());
  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    throw new Error(
      (respJSON as ApiErrorResponse).err_msg
    );
  }

  respJSON.main_pic_url = pickMainImage({
    mainImg: respJSON.main_pic_url,
    sharedImgs: respJSON.shared_images,
    variationImgs: respJSON.variation_images,
  });

  return respJSON;
}

export const fetchNewProductURL = async (uuid: string) => {
  const url = new URL(envs.PEASY_DEAL_ENDPOINT);
  url.pathname = '/v1/products/compose-new-url-link';
  url.searchParams.set('product_uuid', uuid)
  const resp = await fetch(url.toString(), { method: 'GET' });
  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    throw new Error((respJSON as ApiErrorResponse).err_msg);
  }

  const { new_url } = respJSON;

  return new_url;
}

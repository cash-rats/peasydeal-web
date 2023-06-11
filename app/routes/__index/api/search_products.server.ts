import httpStatus from 'http-status-codes';

import type { Product, ApiErrorResponse } from '~/shared/types';
import { PEASY_DEAL_ENDPOINT } from '~/utils/get_env_source';

import { pickMainImage } from '../utils';

export interface SearchProductResponse {
  products: Product[];
  total: number;
  current: number;
  has_more: boolean;
};

export interface SearchProductsParams {
  query: string;
  perpage?: number;
  page?: number;
};

export const searchProducts = async ({ query, perpage = 8, page = 1 }: SearchProductsParams): Promise<SearchProductResponse> => {
  try {
    const url = new URL(PEASY_DEAL_ENDPOINT);
    url.pathname = '/v1/products/search';
    url.searchParams.append('query', query);
    url.searchParams.append('per_page', perpage.toString());
    url.searchParams.append('page', page.toString());

    const resp = await fetch(url.toString());
    const respJSON = await resp.json();

    if (resp.status !== httpStatus.OK) {
      const errResp = respJSON as ApiErrorResponse;
      throw new Error(errResp.err_msg);
    }

    return {
      products: normalizeSearchProduct(respJSON.items),
      total: respJSON.total,
      current: respJSON.current,
      has_more: respJSON.has_more,
    }
  } catch (err) {
    throw err;
  }
}

const normalizeSearchProduct = (apiData: any[]): Product[] => {
  const transformed: Product[] = apiData.map((data: any): Product => {
    return {
      currency: data.currency,
      description: data.description || '',
      discount: data.discount,
      main_pic: pickMainImage(
        data.shared_images,
        data.variation_images,
      ),
      productUUID: data.product_uuid,
      retailPrice: data.retail_price,
      salePrice: data.sale_price,
      shortDescription: data.shortDescription,
      createdAt: data.created_at,
      title: data.title,
      variationID: data.variationId || '',
      tabComboType: data.tag_combo_type,
    };
  })

  return transformed;
}
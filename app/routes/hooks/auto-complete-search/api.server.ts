import httpStatus from 'http-status-codes';

import type { Product, ApiErrorResponse } from '~/shared/types';

import { PEASY_DEAL_ENDPOINT } from '~/utils/get_env_source';

export interface SearchProductPreviewsParams {
  page?: number;
  perPage?: number;
  query: string;
}

const searchProductPreviews = async ({ query, page = 1, perPage = 8 }: SearchProductPreviewsParams): Promise<Product[]> => {
  const url = new URL(PEASY_DEAL_ENDPOINT);
  url.pathname = '/v1/products/search-previews';
  url.searchParams.append('query', query);
  url.searchParams.append('per_page', perPage.toString());
  url.searchParams.append('page', page.toString());

  const resp = await fetch(url.toString());
  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    const errResp = respJSON as ApiErrorResponse;
    throw new Error(errResp.err_message);
  }

  return normalizeData(respJSON.items);
}

const normalizeData = (items: any[]): Product[] => {
  return items.map((item: any): Product => {
    return {
      currency: item.currency,
      description: '',
      discount: item.discount,
      main_pic: item.images[0] || '',
      productUUID: item.product_uuid,
      retailPrice: item.retail_price,
      salePrice: item.sale_price,
      shortDescription: '',
      subtitle: '',
      title: item.title,
      variationID: '',
      tabComboType: item.tag_combo_type,
    }
  });
}

export { searchProductPreviews };
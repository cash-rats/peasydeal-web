import { PEASY_DEAL_ENDPOINT } from '~/utils/get_env_source';
import type { Product, ApiErrorResponse } from '~/shared/types';
import httpStatus from 'http-status-codes';

interface FetchPromotionProductsParams {
  promoName?: string;
  page?: number;
  perpage?: number;
}

export interface FetchPromotionProductsResponse {
  label: string;
  name: string;
  desc: string;
  total: number;
  current: number;
  hasMore: boolean;
  items: Product[];
}

const normalizePromotionProducts = (data: any): Product[] => {
  return data.map((data: any): Product => {
    return {
      currency: data.currency,
      description: '',
      discount: data.discount,
      main_pic: data.images && data.images.length > 0 ? data.images[0] : '',
      productUUID: data.product_uuid,
      retailPrice: data.retail_price,
      salePrice: data.sale_price,
      shortDescription: '',
      subtitle: '',
      title: data.title,
      createdAt: data.created_at,
      variationID: data.variationId,
      tabComboType: data.tag_combo_type,
      variations: data.variations,
    };
  })
}

export const fetchPromotionProducts = async (params: FetchPromotionProductsParams): Promise<FetchPromotionProductsResponse> => {
  if (!params.perpage) params.perpage = 8;
  if (!params.page) params.page = 1;
  if (!params.promoName) params.promoName = 'launch_sales';

  const url = new URL(PEASY_DEAL_ENDPOINT);
  url.pathname = '/v1/products/promotion';
  url.searchParams.append('name', params.promoName);
  url.searchParams.append('page', params.page.toString());
  url.searchParams.append('per_page', params.perpage.toString());

  const resp = await fetch(url.toString());
  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    const errResp = respJSON as ApiErrorResponse;
    throw new Error(errResp.err_msg);
  }

  return {
    ...respJSON,
    items: normalizePromotionProducts(respJSON.items),
    hasMore: respJSON.has_more,
  };
}
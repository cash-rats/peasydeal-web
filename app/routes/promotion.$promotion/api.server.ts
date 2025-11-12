import httpStatus from 'http-status-codes';

import { envs } from '~/utils/env';
import type { Product, ApiErrorResponse } from '~/shared/types';

import { pickMainImage } from '~/routes/__index/utils';

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
  return data.map((item: any): Product => ({
    currency: item.currency,
    description: '',
    discount: item.discount,
    main_pic: pickMainImage({
      mainImg: item.main_pic_url,
      sharedImgs: item.shared_images,
      variationImgs: item.variation_images,
    }),
    productUUID: item.product_uuid,
    retailPrice: item.retail_price,
    salePrice: item.sale_price,
    shortDescription: '',
    title: item.title,
    createdAt: item.created_at,
    variationID: item.variationId,
    tabComboType: item.tag_combo_type,
    variations: item.variations,
  }));
};

export const fetchPromotionProducts = async (
  params: FetchPromotionProductsParams
): Promise<FetchPromotionProductsResponse> => {
  if (!params.perpage) params.perpage = 8;
  if (!params.page) params.page = 1;
  if (!params.promoName) params.promoName = 'launch_sales';

  const url = new URL(envs.PEASY_DEAL_ENDPOINT);
  url.pathname = '/v2/products/promotion';
  url.searchParams.append('name', params.promoName);
  url.searchParams.append('page', params.page.toString());
  url.searchParams.append('per_page', params.perpage.toString());

  const resp = await fetch(url.toString());
  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    const errResp = respJSON as ApiErrorResponse;
    throw new Error(errResp.error);
  }

  return {
    ...respJSON,
    items: normalizePromotionProducts(respJSON.items),
    hasMore: respJSON.has_more,
  };
};

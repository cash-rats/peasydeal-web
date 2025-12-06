import httpStatus from 'http-status-codes';
import * as contentful from 'contentful';

import type { Product, ApiErrorResponse, TContentfulPost } from '~/shared/types';
import type { ActivityBanner } from '~/routes/__index/types';
import { pickMainImage } from '~/utils/images';
import { envs } from '~/utils/env';

export interface FetchProductsByCategoryV2Params {
  category?: string;
  perpage?: number;
  page?: number;
  random?: boolean;
}

interface IFetchProductsByCategoryV2Response {
  items: Product[];
  total: number;
  current: number;
  hasMore: boolean;
}

export interface IFetchLandingPageFeatureProductsParams {
  categoriesPreviewNames: string[];
  prmotionPreviewNames?: string[];
}

interface IContentfulRes {
  fields?: TContentfulPost;
}

const contenfulClient = contentful.createClient({
  space: envs.CONTENTFUL_SPACE_ID,
  accessToken: envs.CONTENTFUL_ACCESS_TOKEN,
});

const normalizeV2Data = (apiData: any[]): Product[] => {
  return apiData.map(
    (data: any): Product => ({
      currency: data.currency,
      description: '',
      discount: data.discount,
      main_pic: pickMainImage({
        mainImg: data.main_pic_url,
        sharedImgs: data.shared_images,
        variationImgs: data.variation_images,
      }) as string | null,
      productUUID: data.product_uuid,
      retailPrice: data.retail_price,
      salePrice: data.sale_price,
      shortDescription: '',
      title: data.title,
      createdAt: data.created_at,
      variationID: data.variationId,
      tabComboType: data.tag_combo_type,
      variations: data.variations,
    })
  );
};

export const fetchLandingPageFeatureProducts = async ({
  categoriesPreviewNames = [],
}: IFetchLandingPageFeatureProductsParams) => {
  const url = new URL(envs.PEASY_DEAL_ENDPOINT);

  url.pathname = '/v2/products/landing-page';
  url.searchParams.append('cat_preview_names', categoriesPreviewNames.join(','));

  const resp = await fetch(url.toString());
  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    const errResp = respJSON as ApiErrorResponse;
    throw new Error(errResp.err_msg);
  }

  const categoryPreviews = respJSON.category_previews
    ? respJSON.category_previews.map((categoryPreview: any) => ({
      ...categoryPreview,
      items: normalizeV2Data(categoryPreview.items),
    }))
    : [];

  const promotionPreviews = respJSON.promotion_previews
    ? respJSON.promotion_previews.map((promotionPreview: any) => ({
      ...promotionPreview,
      items: normalizeV2Data(promotionPreview.items),
    }))
    : [];

  return {
    categoryPreviews,
    promotionPreviews,
    promotions: respJSON?.promotions || [],
  };
};

export const fetchContentfulPostWithId = async ({ entryId }: { entryId: string }) => {
  try {
    const resp = await contenfulClient.getEntry<IContentfulRes>(entryId);
    return resp?.fields;
  } catch (error: any) {
    console.error(error);

    throw new Error(error?.message);
  }
};

export const fetchProductsByCategoryV2 = async ({
  category,
  perpage,
  page,
  random,
}: FetchProductsByCategoryV2Params): Promise<IFetchProductsByCategoryV2Response> => {
  if (!perpage) perpage = 8;
  if (!page) page = 1;
  if (!category) category = 'hot_deal';

  const url = new URL(envs.PEASY_DEAL_ENDPOINT);
  url.pathname = '/v2/products';
  url.searchParams.append('per_page', perpage.toString());
  url.searchParams.append('page', page.toString());
  url.searchParams.append('category', category.toString());
  url.searchParams.append('random', random ? 'true' : 'false');

  const resp = await fetch(url.toString());
  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    return {
      items: [],
      total: 0,
      current: 0,
      hasMore: false,
    };
  }

  return {
    items: normalizeV2Data(respJSON.items),
    total: respJSON.total,
    current: respJSON.current,
    hasMore: respJSON.has_more,
  };
};

export default fetchProductsByCategoryV2;

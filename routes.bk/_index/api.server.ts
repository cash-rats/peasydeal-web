import httpStatus from 'http-status-codes';

import { envs } from '~/utils/env';
import { pickMainImage } from '~/utils/images';
import type {
  ApiErrorResponse,
  Product,
  TCategoryPreview,
  TPromotionType,
} from '~/shared/types';

const normalizeV2Data = (apiData: any[]): Product[] => {
  return apiData.map((data: any): Product => {
    return {
      currency: data.currency,
      description: '',
      discount: data.discount,
      main_pic: pickMainImage({
        mainImg: data.main_pic_url,
        sharedImgs: data.shared_images,
        variationImgs: data.variation_images,
      }) as any,
      productUUID: data.product_uuid,
      retailPrice: data.retail_price,
      salePrice: data.sale_price,
      shortDescription: '',
      title: data.title,
      createdAt: data.created_at,
      variationID: data.variationId,
      tabComboType: data.tag_combo_type,
      variations: data.variations,
    };
  });
};

export interface FetchLandingPageFeatureProductsParams {
  categoriesPreviewNames: string[];
  prmotionPreviewNames?: string[];
}

export type LandingPageFeatureProducts = {
  categoryPreviews: TCategoryPreview[];
  promotionPreviews: TCategoryPreview[];
  promotions: TPromotionType[];
};

export const fetchLandingPageFeatureProducts = async ({
  categoriesPreviewNames = [],
}: FetchLandingPageFeatureProductsParams): Promise<LandingPageFeatureProducts> => {
  const url = new URL(envs.PEASY_DEAL_ENDPOINT);
  url.pathname = '/v2/products/landing-page';
  url.searchParams.append('cat_preview_names', categoriesPreviewNames.join(','));

  const resp = await fetch(url.toString());
  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    const errResp = respJSON as ApiErrorResponse & { err_msg?: string };
    throw new Error(errResp.err_msg || errResp.error || 'Failed to fetch landing page data');
  }

  const categoryPreviews: TCategoryPreview[] = (respJSON.category_previews ?? []).map(
    (categoryPreview: any) =>
      ({
        ...categoryPreview,
        items: normalizeV2Data(categoryPreview.items),
      }) as TCategoryPreview
  );

  const promotionPreviews: TCategoryPreview[] = (respJSON.promotion_previews ?? []).map(
    (promotionPreview: any) =>
      ({
        ...promotionPreview,
        items: normalizeV2Data(promotionPreview.items),
      }) as TCategoryPreview
  );

  return {
    categoryPreviews,
    promotionPreviews,
    promotions: (respJSON?.promotions || []) as TPromotionType[],
  };
};

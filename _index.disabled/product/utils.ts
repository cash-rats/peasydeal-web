import type { ShoppingCartItem } from '~/sessions/types';

import type { ProductDetail, ProductVariation, ProductImg } from './types';
import { pickMainImage } from '../utils';

type INormalizeToSessionStorableCartItem = {
  productDetail: ProductDetail;
  productVariation?: ProductVariation;
  quantity: number;
}

const normalizeToSessionStorableCartItem = ({
  productDetail,
  productVariation,
  quantity,
}: INormalizeToSessionStorableCartItem): ShoppingCartItem => {
  // A product doesn't have any `spec_name` if the product has 1 variation only
  // other wise `Default Title` would appeared in `/cart`.
  const specName = productDetail.variations.length === 1
    ? ''
    : productVariation?.spec_name || '';

  let mainImg = tryPickUserSelectedVariationImage(
    productVariation?.uuid || '',
    productDetail.variation_images,
  )

  if (!mainImg) {
    mainImg = pickMainImage({
      mainImg: productDetail.main_pic_url,
      sharedImgs: productDetail.shared_images,
      variationImgs: productDetail.variation_images
    }).url || '';
  }

  return {
    salePrice: productVariation?.sale_price.toString() || '',
    retailPrice: productVariation?.retail_price.toString() || '',
    productUUID: productDetail.uuid,
    variationUUID: productVariation?.uuid || '',
    tagComboTags: productDetail.tag_combo_tags,

    // image: mainImg
    //   ? mainImg.url
    //   : tryPickUserSelectedVariationImage(
    //     productVariation?.uuid || '',
    //     productDetail.variation_images,
    //   ),
    image: tryPickUserSelectedVariationImage(
      productVariation?.uuid || '',
      productDetail.variation_images,
    ) || '',

    quantity: quantity.toString(),
    title: productDetail?.title || '',
    specName,
    purchaseLimit: productVariation?.purchase_limit?.toString() || '',
  }
}

const findDefaultVariation = (pd: ProductDetail) => (
  pd.variations.find(
    (variation: any) => pd.default_variation_uuid === variation.uuid,
  )
);

/**
 * Check if incoming url matches old product pattern: /product/6920999698491
 */
const OldProdURLPattern = /product\/(\d{13})$/;
const matchOldProductURL = (url: string): string[] => {
  const matches = OldProdURLPattern.exec(url);

  if (!matches) {
    return [];
  }

  return matches;
};

const tryPickUserSelectedVariationImage = (uuid: string, images: ProductImg[]): string | null => {
  const found = images
    .find(image => image.variation_uuid === uuid);

  return !!found
    ? found.url
    : null;
};

export {
  normalizeToSessionStorableCartItem,
  findDefaultVariation,
  matchOldProductURL,
  tryPickUserSelectedVariationImage,
};

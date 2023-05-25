import type { ShoppingCartItem } from '~/sessions/shoppingcart.session';

import type {
  ProductDetail,
  ProductVariation,
  ProductImg,
} from './types';

export const pickMainImage = (sharedImgs: ProductImg[], variationImgs: ProductImg[]): null | ProductImg => {
  if (sharedImgs.length === 0 && variationImgs.length === 0) {
    return null
  }

  if (sharedImgs.length > 0) {
    return sharedImgs[0]
  }

  return variationImgs[0];
};

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

  const mainImg = pickMainImage(
    productDetail.shared_images,
    productDetail.variation_images
  );

  return {
    salePrice: productVariation?.sale_price.toString() || '',
    retailPrice: productVariation?.retail_price.toString() || '',
    productUUID: productDetail.uuid,
    variationUUID: productVariation?.uuid || '',
    tagComboTags: productDetail.tag_combo_tags,

    image: mainImg
      ? mainImg.url
      : '',

    quantity: quantity.toString(),
    title: productDetail?.title || '',
    specName: specName,
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



export {
  normalizeToSessionStorableCartItem,
  findDefaultVariation,
  matchOldProductURL,
};
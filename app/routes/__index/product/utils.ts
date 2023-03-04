import type { ShoppingCartItem } from '~/sessions/shoppingcart.session';

import type { ProductDetail, ProductVariation } from './types';

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
    : productVariation?.spec_name || ''

  return {
    salePrice: productVariation?.sale_price.toString() || '',
    retailPrice: productVariation?.retail_price.toString() || '',
    productUUID: productDetail.uuid,
    variationUUID: productVariation?.uuid || '',

    // product variation does not have "main_pic" yet, thus, we take the first product image to be displayed in shopping cart.
    image: productDetail.images[0] || '',
    quantity: quantity.toString(),
    title: productDetail?.title || '',
    specName: specName,
    purchaseLimit: productVariation?.purchase_limit?.toString() || '',
  }
}

export { normalizeToSessionStorableCartItem };
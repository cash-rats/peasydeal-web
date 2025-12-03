import { useReducer, useMemo } from 'react';

import { normalizeToSessionStorableCartItem, findDefaultVariation } from '../utils';
import type { ProductDetail } from '../types';
import reducer from '../reducer';

export function useProductState(product: ProductDetail) {
  const mainCategory = useMemo(() => {
    return (
      product?.categories &&
      product?.categories.length > 0
    )
      ? product.categories[0]
      : null;
  }, [product?.categories]);

  const defaultVariation = useMemo(() => findDefaultVariation(product), [product]);
  const tags = useMemo(() => product.tag_combo_tags?.split(',') || [], [product]);

  const [state, dispatch] = useReducer(reducer, {
    productDetail: product,
    categories: product?.categories,
    mainCategory,
    mainPicUrl: product.main_pic_url,
    sharedImages: product.shared_images,
    variationImages: product.variation_images,
    quantity: 1,
    variation: defaultVariation,
    tags,
    sessionStorableCartItem: normalizeToSessionStorableCartItem({
      productDetail: product,
      productVariation: defaultVariation,
      quantity: 1,
    }),
  });

  return { state, dispatch };
}


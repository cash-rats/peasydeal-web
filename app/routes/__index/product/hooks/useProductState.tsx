import { useReducer, useMemo } from 'react';

import { normalizeToSessionStorableCartItem, findDefaultVariation } from '../utils';
import type { LoaderTypeProductDetail } from '../types';
import reducer from '../reducer';

export function useProductState(loaderData: LoaderTypeProductDetail) {
  const mainCategory = useMemo(() => {
    return (
      loaderData?.product?.categories &&
      loaderData?.product?.categories.length > 0
    )
      ? loaderData.product.categories[0]
      : null;
  }, [loaderData?.product?.categories]);

  const defaultVariation = useMemo(() => {
    return findDefaultVariation(loaderData.product);
  }, [loaderData?.product]);

  const tags = useMemo(() => {
    // return loaderData.product.tag_combo_tags || '';
    return loaderData.product.tag_combo_tags?.split(',') || [];
  }, [loaderData?.product]);

  const [state, dispatch] = useReducer(reducer, {
    productDetail: loaderData?.product,
    categories: loaderData?.product?.categories,
    mainCategory,
    sharedImages: loaderData?.product.shared_images,
    variationImages: loaderData?.product.variation_images,
    quantity: 1,
    variation: defaultVariation,
    tags,
    sessionStorableCartItem: normalizeToSessionStorableCartItem({
      productDetail: loaderData?.product,
      productVariation: defaultVariation,
      quantity: 1,
    }),
  });

  return { state, dispatch };
}


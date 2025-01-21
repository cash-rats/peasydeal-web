import { useEffect } from 'react';
import { getSessionIDFromSessionStore } from '~/services/daily_session';
import type { ProductDetail } from '../types';
import { changeProduct, updateProductImages, setVariation } from '../reducer';
import { findDefaultVariation } from '../utils';

interface UseProductChangeProps {
  product: ProductDetail;
  dispatch: (action: any) => void; // Replace 'any' with your action types
}

export function useProductChange({ product, dispatch }: UseProductChangeProps) {
  useEffect(() => {
    // This action updates detail to new product also clears images of previous product images.
    dispatch(changeProduct(product));

    // Update product images to new product after current event loop.
    setTimeout(() => {
      dispatch(updateProductImages(
        product.shared_images,
        product.variation_images,
      ));
    }, 100);

    const gaSessionID = getSessionIDFromSessionStore();

    window
      .rudderanalytics
      ?.track('view_product_detail', {
        session: gaSessionID,
        product: `${product.title}_${product.uuid}`
      });
  }, [product.uuid]);
}


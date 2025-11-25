import { useEffect, useRef } from 'react';
import { getSessionIDFromSessionStore } from '~/services/daily_session';
import { changeProduct, updateProductImages } from '../reducer';
import type { ProductDetail } from '../types';

interface UseProductChangeProps {
  product: ProductDetail;
  dispatch: (action: any) => void; // Replace 'any' with your action types
}

export function useProductChange({ product, dispatch }: UseProductChangeProps) {
  const initialRender = useRef(true);

  useEffect(() => {
    // User can not be changing product on initial render of product detail page.
    // Only possible when user clicks on other product link.
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

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


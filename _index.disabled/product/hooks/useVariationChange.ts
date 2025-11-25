import { useEffect } from 'react';

import { findDefaultVariation } from '../utils';
import { setVariation, type ProductAction } from '../reducer';
import type { ProductDetail } from '../types';

interface UseProductChangeProps {
  product: ProductDetail;
  dispatch: (action: ProductAction) => void;
}

export function useVariationChange({ product, dispatch }: UseProductChangeProps) {
  useEffect(() => {
    const currentVariation = findDefaultVariation(product);
    if (!currentVariation) return;
    dispatch(setVariation(currentVariation));
  }, [product]);
}
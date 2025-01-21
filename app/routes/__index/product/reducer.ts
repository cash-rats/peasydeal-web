import { produce, type Draft } from 'immer';
import  { type ShoppingCartItem } from '~/sessions/shoppingcart.session';

import {
  normalizeToSessionStorableCartItem,
  findDefaultVariation,
} from './utils';

import type {
  ProductDetail,
  ProductVariation,
  ProductImg,
  Category,
} from './types';

type ProductState = {
  productDetail: ProductDetail;
  variation: ProductVariation | undefined;
  sharedImages: ProductImg[];
  variationImages: ProductImg[];
  quantity: number;
  categories: Category[];
  mainCategory: Category | null;
  sessionStorableCartItem: ShoppingCartItem;
  tags: string[];
}

export type ProductAction =
  | { type: 'CHANGE_PRODUCT', payload: ProductDetail }
  | { type: 'UPDATE_PRODUCT_IMAGES', payload: { sharedImgs: ProductImg[], variationImgs: ProductImg[] } }
  | { type: 'UPDATE_QUANTITY', payload: number }
  | { type: 'SET_VARIATION', payload: ProductVariation }

// ------- action creators -------
export const updateProductImages = (sharedImgs: ProductImg[], variationImgs: ProductImg[]): ProductAction => {
  return {
    type: 'UPDATE_PRODUCT_IMAGES',
    payload: {
      sharedImgs,
      variationImgs,
    },
  };
};

export const changeProduct = (product: ProductDetail): ProductAction => {
  return {
    type: 'CHANGE_PRODUCT',
    payload: product,
  };
};

export const setVariation = (variation: ProductVariation): ProductAction => {
  return {
    type: 'SET_VARIATION',
    payload: variation,
  };
}

export const updateQuantity = (quantity: number): ProductAction => {
  return {
    type: 'UPDATE_QUANTITY',
    payload: quantity,
  };
}

const reducer = produce((draft: Draft<ProductState>, action: ProductAction) => {
  switch (action.type) {
    case 'CHANGE_PRODUCT': {
      const data = action.payload as ProductDetail;

      const defaultVariation = findDefaultVariation(data);

      // We need to clear previous images before displaying new
      // product images.
      draft.sharedImages = [];
      draft.variationImages = [];
      draft.categories = data.categories;
      draft.mainCategory = data.categories[0];
      draft.productDetail = { ...data };
      draft.variation = defaultVariation;
      draft.quantity = 1;
      draft.sessionStorableCartItem = normalizeToSessionStorableCartItem({
        productDetail: data,
        productVariation: defaultVariation,
        quantity: 1,
      });
    }
    case 'UPDATE_PRODUCT_IMAGES': {
      const { sharedImgs, variationImgs } = action.payload as {
        sharedImgs: ProductImg[],
        variationImgs: ProductImg[],
      };

      draft.sharedImages = sharedImgs;
      draft.variationImages = variationImgs;
    }
    case 'UPDATE_QUANTITY': {
      const quantity = action.payload as number;
      draft.quantity = quantity;
      draft.sessionStorableCartItem = {
        ...draft.sessionStorableCartItem,
        quantity: quantity.toString(),
      };
    }
    case 'SET_VARIATION': {
      const variation = action.payload as ProductVariation;

      draft.variation = variation;
      draft.sessionStorableCartItem = normalizeToSessionStorableCartItem({
        productDetail: draft.productDetail,
        productVariation: variation,
        quantity: draft.quantity,
      });
    }
    default:
      return draft;
  }
});

export default reducer;
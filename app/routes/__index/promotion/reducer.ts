import type { Product, Category } from '~/shared/types';

import { modToXItems } from '../utils';

export type StateShape = {
  productRows: Product[][];
  products: Product[];
  category: Category;
  total: number;
  current: number;
  hasMore: boolean;
  page: number;
};

export enum PromotionActionType {
  set_products = 'set_products',
  append_products = 'append_products',
  update_category = 'update_category',
};

interface ProductsPayload {
  products: Product[];
  total: number;
  current: number;
  page: number;
}

interface UpdateCategoryPayload {
  category: Category;
};

interface PromotionActions {
  type: PromotionActionType;
  payload: ProductsPayload | UpdateCategoryPayload;
}

export default function collectionReducer(state: StateShape, action: PromotionActions): StateShape {
  switch (action.type) {
    case PromotionActionType.set_products: {
      const {
        products,
        total,
        current,
        page,
      } = action.payload as ProductsPayload;

      return {
        ...state,
        productRows: modToXItems(products, 8),
        products,
        total,
        current,
        hasMore: current < total,
        page,
      }
    }
    case PromotionActionType.append_products: {
      const {
        products,
        total,
        current,
        page,
      } = action.payload as ProductsPayload;

      const extProds = state.products.concat(products);

      return {
        ...state,
        productRows: modToXItems(extProds, 8),
        products: extProds,
        total,
        current,
        hasMore: current < total,
        page,
      };
    }
    default:
      return state;
  }
}
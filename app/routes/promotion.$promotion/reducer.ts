import type { Product, Category } from '~/shared/types';

export type StateShape = {
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
  change_category = 'change_category',
}

interface ProductsPayload {
  products: Product[];
  total: number;
  current: number;
  page: number;
}

interface ChangeCategoryPayload {
  category: Category;
  products: Product[];
  page: number;
  current: number;
  total: number;
}

interface PromotionActions {
  type: PromotionActionType;
  payload: ProductsPayload | ChangeCategoryPayload;
}

export default function promotionReducer(state: StateShape, action: PromotionActions): StateShape {
  switch (action.type) {
    case PromotionActionType.set_products: {
      const { products, total, current, page } = action.payload as ProductsPayload;

      return {
        ...state,
        products,
        total,
        current,
        hasMore: current < total,
        page,
      };
    }
    case PromotionActionType.append_products: {
      const { products, total, current, page } = action.payload as ProductsPayload;
      const extProds = state.products.concat(products);

      return {
        ...state,
        products: extProds,
        total,
        current,
        hasMore: current < total,
        page,
      };
    }
    case PromotionActionType.change_category: {
      const { category, products, page, current, total } = action.payload as ChangeCategoryPayload;
      return {
        ...state,
        category,
        products,
        page,
        current,
        total,
      };
    }
    default:
      return state;
  }
}

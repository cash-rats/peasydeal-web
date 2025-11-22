import type { Product, TaxonomyWithParents } from '~/shared/types';

export type StateShape = {
  products: Product[];
  total: number;
  current: number;
  hasMore: boolean;
  category: TaxonomyWithParents;
};

export enum CollectionActionType {
  set_products = 'set_products',
  append_products = 'append_products',
}

interface ProductsPayload {
  products: Product[];
  total: number;
  current: number;
}

interface SetProductPayload extends ProductsPayload {
  category: TaxonomyWithParents;
}

interface CollectionActions {
  type: CollectionActionType;
  payload: ProductsPayload | SetProductPayload | boolean;
}

export default function collectionReducer(state: StateShape, action: CollectionActions): StateShape {
  switch (action.type) {
    case CollectionActionType.set_products: {
      const { products, total, current, category } = action.payload as SetProductPayload;

      return {
        ...state,
        products,
        total,
        current,
        hasMore: current < total,
        category,
      };
    }
    case CollectionActionType.append_products: {
      const { products, total, current } = action.payload as ProductsPayload;

      const extProds = state.products.concat(products);

      return {
        ...state,
        products: extProds,
        total,
        current,
        hasMore: current < total,
      };
    }
    default:
      return state;
  }
}

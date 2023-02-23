import type { Product } from '~/shared/types';


export type StateShape = {
  products: Product[];
  total: number;
  current: number;
  hasMore: boolean,
};

export enum CollectionActionType {
  set_products = 'set_products',
  append_products = 'append_products',
};

export const initState: StateShape = {
  products: [],
  total: 0,
  current: 0,
  hasMore: false,
};

interface ProductsPayload {
  products: Product[];
  total: number;
  current: number;
}

interface CollectionActions {
  type: CollectionActionType;
  payload: ProductsPayload
}

export default function collectionReducer(state: StateShape, action: CollectionActions): StateShape {
  switch (action.type) {
    case CollectionActionType.set_products: {
      const {
        products,
        total,
        current,
      } = action.payload as ProductsPayload;

      return {
        ...state,
        products,
        total,
        current,
        hasMore: current < total,
      }
    }
    case CollectionActionType.append_products: {
      const {
        products,
        total,
        current,
      } = action.payload as ProductsPayload;

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
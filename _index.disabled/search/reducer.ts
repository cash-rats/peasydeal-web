import type { Product } from '~/shared/types';

export type StateShape = {
  products: Product[];
  query: string;
  page: number;
  total: number;
  current: number;
}

export enum SearchActionType {
  set_products = 'set_products',
  append_products = 'append_products',
  change_search = 'change_search',
}

interface SetProductPayload {
  products: Product[];
  query: string;
  page: number;
  total: number;
  current: number;
}

interface AppendProductPayload {
  products: Product[];
  page: number;
  current: number;
}

interface SearchActions {
  type: SearchActionType;
  payload: SetProductPayload | AppendProductPayload;
}

export default function searchReducer(state: StateShape, action: SearchActions): StateShape {
  switch (action.type) {
    case SearchActionType.set_products: {
      const {
        products,
        page,
        total,
        current,
      } = action.payload as SetProductPayload;

      return {
        ...state,
        products,
        page,
        total,
        current,
      };
    }
    case SearchActionType.append_products: {
      const {
        products,
        page,
        current,
      } = action.payload as AppendProductPayload;

      return {
        ...state,
        products: state.products.concat(products),
        page,
        current,
      };
    }
    default: {
      return state;
    }
  }
}

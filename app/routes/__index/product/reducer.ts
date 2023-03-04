import type { ShoppingCartItem } from '~/sessions/shoppingcart.session';

import { normalizeToSessionStorableCartItem, findDefaultVariation } from './utils';

import type {
  ProductDetail,
  ProductVariation,
  Category,
} from './types';

type StateShape = {
  productDetail: ProductDetail;
  variation: ProductVariation | undefined;
  images: string[];
  quantity: number;
  mainCategory: Category | null;
  sessionStorableCartItem: ShoppingCartItem;
}

export enum ActionTypes {
  change_product = 'change_product',
  update_product_images = 'update_product_images',
  update_quantity = 'update_quantity',
  set_variation = 'set_variation',
};

type Action = {
  type: ActionTypes;
  payload: any;
}

const reducer = (state: StateShape, action: Action): StateShape => {
  switch (action.type) {
    case ActionTypes.change_product: {
      const data = action.payload as ProductDetail;

      const defaultVariation = findDefaultVariation(data);

      // We need to clear previous images once so that those images
      // would dissapear when new product detail is loaded.
      return {
        ...state,
        images: [],
        mainCategory: data.categories[0],
        productDetail: { ...data },
        variation: defaultVariation,
        quantity: 1,
        sessionStorableCartItem: normalizeToSessionStorableCartItem({
          productDetail: data,
          productVariation: defaultVariation,
          quantity: 1,
        }),
      };
    }
    case ActionTypes.update_product_images: {
      const images = action.payload as string[];

      return {
        ...state,
        images: [...images],
      };
    }
    case ActionTypes.update_quantity: {
      const quantity = action.payload;

      return {
        ...state,
        quantity,
        sessionStorableCartItem: {
          ...state.sessionStorableCartItem,
          quantity,
        },
      }
    }

    case ActionTypes.set_variation: {
      const variation = action.payload;
      return {
        ...state,
        variation,
        sessionStorableCartItem: normalizeToSessionStorableCartItem({
          productDetail: state.productDetail,
          productVariation: variation,
          quantity: state.quantity,
        }),
      }
    }

    default:
      return state;
  }
}

export default reducer;
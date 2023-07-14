import type { ShoppingCartItem } from '~/sessions/shoppingcart.session';

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

type StateShape = {
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

export enum ActionTypes {
  change_product = 'change_product',
  update_product_images = 'update_product_images',
  update_quantity = 'update_quantity',
  set_variation = 'set_variation',
};

type Action = {
  type: ActionTypes;
  payload: any;
};

// ------- action creators -------
export const updateProductImages = (sharedImgs: ProductImg[], variationImgs: ProductImg[]) => {
  return {
    type: ActionTypes.update_product_images,
    payload: {
      sharedImgs,
      variationImgs,
    },
  };
};

export const changeProduct = (product: ProductDetail) => {
  return {
    type: ActionTypes.change_product,
    payload: product,
  };
};

export const setVariation = (variation: ProductVariation) => {
  return {
    type: ActionTypes.set_variation,
    payload: variation,
  };
}

const reducer = (state: StateShape, action: Action): StateShape => {
  switch (action.type) {
    case ActionTypes.change_product: {
      const data = action.payload as ProductDetail;

      const defaultVariation = findDefaultVariation(data);

      // We need to clear previous images before displaying new
      // product images.
      return {
        ...state,
        sharedImages: [],
        variationImages: [],
        categories: data.categories,
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
      const { sharedImgs, variationImgs }: {
        sharedImgs: ProductImg[],
        variationImgs: ProductImg[],
      } = action.payload

      return {
        ...state,
        sharedImages: sharedImgs,
        variationImages: variationImgs,
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
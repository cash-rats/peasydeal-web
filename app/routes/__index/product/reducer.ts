import type { ProductDetail } from './types';

type StateShape = {
  productDetail: ProductDetail;
  images: string[];
  quantity: number;
}

export enum ActionTypes {
  change_product = 'change_product',
  update_product_images = 'update_product_images',

  update_quantity = 'update_quantity',
};

type Action = {
  type: ActionTypes;
  payload: any;
}

const reducer = (state: StateShape, action: Action): StateShape => {
  switch (action.type) {
    case ActionTypes.change_product: {
      const data = action.payload as ProductDetail;

      // We need to clear previous images once so that those images
      // would dissapear when new product detail is loaded.
      return {
        ...state,
        images: [],
        productDetail: { ...data }
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
      return {
        ...state,
        quantity: action.payload as number,
      }
    }
    default:
      return state;
  }
}

export default reducer;
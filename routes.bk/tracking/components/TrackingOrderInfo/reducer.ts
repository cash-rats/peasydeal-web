import type { ImmerReducer } from 'use-immer';

import type { TrackOrder, OrderStatus, TrackOrderProduct } from '../../types';
import { PaymentStatus } from '../../types';

interface StateShape {
  reviewProduct: TrackOrderProduct | null;
  orderInfo: TrackOrder;
  error: string | null;

};

export enum TrackingActionTypes {
  review_on_product = 'review_on_product',
  init_order_info = 'init_order_info',
  update_order_status = 'update_order_status',
  set_error = 'set_error',
  reset = 'reset',
};

interface TrackingActions {
  type: TrackingActionTypes;
  payload:
  | TrackOrder
  | TrackOrderProduct
  | OrderStatus
  | string
  | null;
};

// dispatch when modal is closed. so that fetcher, order_uuid, review_product
// can be reset and refreshed.
export const reset = () => ({
  type: TrackingActionTypes.reset,
  payload: null,
});


export const reviewOnProduct = (prod: TrackOrderProduct) => {
  return {
    type: TrackingActionTypes.review_on_product,
    payload: prod,
  };
};

const reducer: ImmerReducer<StateShape, TrackingActions> = (draft, action) => {
  switch (action.type) {
    case TrackingActionTypes.init_order_info: {
      const trackOrder = action.payload as TrackOrder;
      draft.orderInfo = trackOrder;
      draft.error = null;
      break;
    }
    case TrackingActionTypes.update_order_status: {
      const orderStatus = action.payload as OrderStatus;
      draft.orderInfo.order_status = orderStatus;
      draft.orderInfo.payment_status = PaymentStatus.ReviewRefund;
      break;
    }
    case TrackingActionTypes.set_error: {
      const error = action.payload as string;
      draft.error = error;
      break;
    }
    case TrackingActionTypes.review_on_product: {
      const prod = action.payload as TrackOrderProduct
      draft.reviewProduct = prod;
      break;
    }
    case TrackingActionTypes.reset: {
      draft.reviewProduct = null;
      break;
    }
    default:
      break;
  }
};

export default reducer
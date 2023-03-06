import type { ImmerReducer } from 'use-immer';

import type { TrackOrder, OrderStatus } from '../../types';

interface StateShape {
  orderInfo: TrackOrder;
  error: string | null;
};

export enum TrackingActionTypes {
  init_order_info = 'init_order_info',
  update_order_status = 'update_order_status',
  set_error = 'set_error',
};

interface TrackingActions {
  type: TrackingActionTypes,
  payload:
  | TrackOrder
  | OrderStatus
  | string
  | null;
};

const reducer: ImmerReducer<StateShape, TrackingActions> = (draft, action) => {
  switch (action.type) {
    case TrackingActionTypes.init_order_info: {
      const trackOrder = action.payload as TrackOrder;
      draft.orderInfo = trackOrder;
      draft.error = null;
      break;;
    }
    case TrackingActionTypes.update_order_status: {
      const orderStatus = action.payload as OrderStatus;
      draft.orderInfo.order_status = orderStatus;
      break;
    }
    case TrackingActionTypes.set_error: {
      const error = action.payload as string;
      draft.error = error;
      break;
    }
    default:
      break;
  }
};

export default reducer
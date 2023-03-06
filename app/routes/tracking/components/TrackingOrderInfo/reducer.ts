import type { ImmerReducer } from 'use-immer';

import type { TrackOrder, OrderStatus } from '../../types';

interface StateShape {
  orderInfo: TrackOrder;
  error: string | null;
};

export enum TrackingActionTypes {
  update_order_status = 'update_order_status',
  set_error = 'set_error',
};

interface TrackingActions {
  type: TrackingActionTypes,
  payload:
  | OrderStatus
  | string
  | null;
};

const reducer: ImmerReducer<StateShape, TrackingActions> = (draft, action) => {
  switch (action.type) {
    case TrackingActionTypes.update_order_status: {
      const orderStatus = action.payload as OrderStatus;
      draft.orderInfo.order_status = orderStatus;
    }
    case TrackingActionTypes.set_error: {
      const error = action.payload as string;
      draft.error = error;
    }
    default:
      break;
  }
};

export default reducer
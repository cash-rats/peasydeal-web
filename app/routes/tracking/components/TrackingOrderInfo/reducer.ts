import type { ImmerReducer } from 'use-immer';

import type { TrackOrder, OrderStatus } from '../../types';

interface StateShape {
  orderInfo: TrackOrder;
}

export enum TrackingActionTypes {
  update_order_status = 'update_order_status',
};

interface TrackingActions {
  type: TrackingActionTypes,
  payload:
  | OrderStatus
  | string;
};

const reducer: ImmerReducer<StateShape, TrackingActions> = (draft, action) => {
  switch (action.type) {
    case TrackingActionTypes.update_order_status: {
      const orderStatus = action.payload as OrderStatus;
      draft.orderInfo.order_status = orderStatus;
    }
    default:
      break;
  }
};

export default reducer
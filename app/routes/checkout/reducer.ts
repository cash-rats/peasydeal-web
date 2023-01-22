import produce from 'immer';

export type StateShape = {
  orderUUID: string;
  paypalOrderID: string;
}

export const inistialState: StateShape = {
  orderUUID: '',
  paypalOrderID: '',
};

export enum ActionTypes {
  set_order_uuid = 'set_order_uuid',
  set_paypal_order_id = 'set_paypal_order_id',
  set_both_paypal_and_peasydeal_order_id = 'set_both_paypal_and_peasydeal_order_id',
}

type SetBothOrderID = {
  orderUUID: string;
  paypalOrderID: string;
}

interface CheckoutAction {
  type: ActionTypes;
  payload: string | SetBothOrderID;
}

const checkoutReducer = produce((draft, action: CheckoutAction) => {
  switch (action.type) {
    case ActionTypes.set_order_uuid: {
      draft.orderID = action.payload;
      break;
    }
    case ActionTypes.set_paypal_order_id: {
      draft.paypalOrderID = action.payload;
      break;
    }
    case ActionTypes.set_both_paypal_and_peasydeal_order_id: {
      const data = action.payload as SetBothOrderID;
      draft.orderID = data.orderUUID;
      draft.paypalOrderID = data.paypalOrderID;
      break;
    }
  }
})
export default checkoutReducer;
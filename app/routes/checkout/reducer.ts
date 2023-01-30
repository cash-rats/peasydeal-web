export type StateShape = {
  orderUUID: string;
  paypalOrderID: string;
  disablePaypalButton: boolean
}

export const inistialState: StateShape = {
  orderUUID: '',
  paypalOrderID: '',
  disablePaypalButton: true,
};

export enum ActionTypes {
  set_order_uuid = 'set_order_uuid',
  set_paypal_order_id = 'set_paypal_order_id',
  set_both_paypal_and_peasydeal_order_id = 'set_both_paypal_and_peasydeal_order_id',
  set_disable_paypal_button = 'set_disable_paypal_button'
}

type SetBothOrderID = {
  orderUUID: string;
  paypalOrderID: string;
}

interface CheckoutAction {
  type: ActionTypes;
  payload: string | SetBothOrderID | boolean;
}

const checkoutReducer = (state: StateShape, action: CheckoutAction): StateShape => {
  switch (action.type) {
    case ActionTypes.set_order_uuid: {
      return {
        ...state,
        orderUUID: action.payload as string

      };
    }
    case ActionTypes.set_paypal_order_id: {
      return {
        ...state,
        paypalOrderID: action.payload as string
      }
    }
    case ActionTypes.set_both_paypal_and_peasydeal_order_id: {
      const data = action.payload as SetBothOrderID;
      return {
        ...state,
        orderUUID: data.orderUUID,
        paypalOrderID: data.paypalOrderID,
      }
    }
    case ActionTypes.set_disable_paypal_button: {
      return {
        ...state,
        disablePaypalButton: action.payload as boolean,
      }
    }
    default:
      return state;
  }
}

export default checkoutReducer;
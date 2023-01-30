import ShippingDetailForm from './components/ShippingDetailForm';
import type {
  ShippingDetailFormType,
  ContactInfoFormType,
} from './types';

export type StateShape = {
  orderUUID: string;
  paypalOrderID: string;
  disablePaypalButton: boolean;
  shippingDetailForm: ShippingDetailFormType;
}

export enum ActionTypes {
  set_order_uuid = 'set_order_uuid',
  set_paypal_order_id = 'set_paypal_order_id',
  set_both_paypal_and_peasydeal_order_id = 'set_both_paypal_and_peasydeal_order_id',
  set_disable_paypal_button = 'set_disable_paypal_button',

  update_shipping_detail_form = 'update_shipping_detail_form',
}

type SetBothOrderID = {
  orderUUID: string;
  paypalOrderID: string;
}


type SetShippingDetailForm = {
  [key in keyof ShippingDetailFormType]?: string;
}
interface CheckoutAction {
  type: ActionTypes;
  payload:
  | string
  | SetBothOrderID
  | boolean
  | SetShippingDetailForm;
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
    case ActionTypes.update_shipping_detail_form: {
      const data = action.payload as SetShippingDetailForm;

      console.log('debug in reducer', data);

      return {
        ...state,
        shippingDetailForm: {
          ...state.shippingDetailForm,
          ...data,
        },
      };
    }
    default:
      return state;
  }
}

export default checkoutReducer;
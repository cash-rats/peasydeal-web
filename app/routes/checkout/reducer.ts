import type { CountryData } from 'react-phone-input-2'

import type {
  ShippingDetailFormType,
  ContactInfoFormType,
} from './types';

export type StateShape = {
  orderUUID: string;
  paypalOrderID: string;
  disablePaypalButton: boolean;
  shippingDetailForm: ShippingDetailFormType;
  contactInfoForm: ContactInfoFormType;
}

export const initState: StateShape = {
  orderUUID: '',
  paypalOrderID: '',
  disablePaypalButton: true,
  shippingDetailForm: {
    lastname: '',
    firstname: '',
    address1: '',
    address2: '',
    postal: '',
    city: '',
  },
  contactInfoForm: {
    email: '',
    country_data: {
      name: '',
      dialCode: '',
      countryCode: '',
      format: '',
    },
    phone_value: '',
    contact_name_same: true,
    contact_name: '',
  }
};

export enum ActionTypes {
  set_order_uuid = 'set_order_uuid',
  set_paypal_order_id = 'set_paypal_order_id',
  set_both_paypal_and_peasydeal_order_id = 'set_both_paypal_and_peasydeal_order_id',
  set_disable_paypal_button = 'set_disable_paypal_button',

  update_shipping_detail_form = 'update_shipping_detail_form',
  update_contact_info_form = 'update_contact_info_form',
}

type SetBothOrderID = {
  orderUUID: string;
  paypalOrderID: string;
}

type UpdateShippingDetailForm = {
  [key in keyof ShippingDetailFormType]?: string;
};

type UpdateContactInfoForm = {
  email?: string;
  country_data?: CountryData,
  phone_value?: string,
  contact_name_same?: boolean,
  contact_name?: string,
};
interface CheckoutAction {
  type: ActionTypes;
  payload:
  | string
  | SetBothOrderID
  | boolean
  | UpdateShippingDetailForm
  | UpdateContactInfoForm;
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
      const data = action.payload as UpdateShippingDetailForm;

      return {
        ...state,
        shippingDetailForm: {
          ...state.shippingDetailForm,
          ...data,
        },
      };
    }
    case ActionTypes.update_contact_info_form: {
      const data = action.payload as UpdateContactInfoForm;

      return {
        ...state,
        contactInfoForm: {
          ...state.contactInfoForm,
          ...data,
          country_data: {
            ...state.contactInfoForm.country_data,
            ...data.country_data,
          },
        }
      };
    }
    default:
      return state;
  }
}

export default checkoutReducer;
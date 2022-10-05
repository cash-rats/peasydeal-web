import type { CountryData } from 'react-phone-input-2'

export type ShippingDetailFormType = {
  email: string;
  lastname: string;
  firstname: string;
  address1: string,
  address2: string,
  postal: string,
  city: string,
};

export type ContactInfoFormType = {
  country_data: CountryData | {},
  phone_value: string,
  contact_name_same: boolean,
  contact_name: string,
};

export interface OrderItem {
  product_id: string;
  variation_uuid: string;
  quantity: string;
};

export interface OrderItemFromAPI {
  [index: string]: any;
}
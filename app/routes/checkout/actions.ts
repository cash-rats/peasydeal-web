import { json, redirect } from '@remix-run/node';
import httpStatus from 'http-status-codes';

import type { PriceInfo } from '~/shared/cart';
import { PaymentMethod } from '~/shared/enums';

import { transformOrderDetail } from './utils';
import {
  createOrder,
  paypalCreateOrder,
  paypalCapturePayment,
} from './api';
import type {
  ShippingDetailFormType,
  ContactInfoFormType,
} from './types';

export enum ActionType {
  PaypalCreateOrder = "paypal_create_order",
  PaypalCapturePayment = "paypal_capture_payment",
  StripeCreateOrder = "stripe_create_order"
};

export type ActionPayload = {
  [k: string]: FormDataEntryValue;
  shipping_form: string;
  contact_info_form: string;
  cart_items: string,
  payment_secret: string;
  price_info: string;
  promo_code: string
};

export type PaypalOrderActionDataType = {
  order_uuid: string;
  paypal_order_id: string;
}

export const __paypalCreateOrder = async (form: ActionPayload) => {
  const {
    shipping_form: shippingForm,
    contact_info_form: contactInfoForm,
    cart_items: cartItems,
    price_info: priceInfo,
    payment_secret,
    promo_code,
  } = form;

  const shippingFormObj: ShippingDetailFormType = JSON.parse(shippingForm);
  const contactInfoFormObj: ContactInfoFormType = JSON.parse(contactInfoForm);
  const priceInfoObj: PriceInfo = JSON.parse(priceInfo);
  const cartItemsObj = JSON.parse(cartItems);
  const trfItemsObj = transformOrderDetail(cartItemsObj);

  const resp = await paypalCreateOrder({
    firstname: shippingFormObj.firstname,
    lastname: shippingFormObj.lastname,
    address1: shippingFormObj.address1,
    address2: shippingFormObj.address2,
    city: shippingFormObj.city,
    postal: shippingFormObj.postal,

    email: contactInfoFormObj.email,
    contact_name: contactInfoFormObj.contact_name,
    phone_value: contactInfoFormObj.phone_value,
    payment_secret,

    products: trfItemsObj,
    price_info: priceInfoObj,
    promo_code,
  });

  return json<PaypalOrderActionDataType>(resp, httpStatus.OK);
}

export const __stripeCreateOrder = async (formObj: ActionPayload) => {
  const {
    shipping_form: shippingForm,
    contact_info_form: contactInfoForm,
    cart_items: cartItems,
    price_info: priceInfo,
    payment_secret,
    promo_code,
  } = formObj

  const shippingFormObj: ShippingDetailFormType = JSON.parse(shippingForm);
  const contactInfoFormObj: ContactInfoFormType = JSON.parse(contactInfoForm);
  const priceInfoObj: PriceInfo = JSON.parse(priceInfo);
  const cartItemsObj = JSON.parse(cartItems);
  const trfItemsObj = transformOrderDetail(cartItemsObj);

  const resp = await createOrder({
    firstname: shippingFormObj.firstname,
    lastname: shippingFormObj.lastname,
    address1: shippingFormObj.address1,
    address2: shippingFormObj.address2,
    city: shippingFormObj.city,
    postal: shippingFormObj.postal,

    email: contactInfoFormObj.email,
    contact_name: contactInfoFormObj.contact_name,
    phone_value: contactInfoFormObj.phone_value,
    payment_secret,

    products: trfItemsObj,
    price_info: priceInfoObj,
    promo_code,
  });

  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    return json(respJSON, httpStatus.OK);
  }

  return json(respJSON, httpStatus.OK);
};

export const __paypalCapturePayment = async (paypalOrderID: string, peasydealOrderID: string) => {
  const resp = await paypalCapturePayment(paypalOrderID);
  const respJSON = JSON.parse(resp.capture_response);

  // TODO: redirect to paypal failed page.
  if (!respJSON.status || respJSON.status !== 'COMPLETED') {
    return redirect(
      `/payment/${peasydealOrderID}/failed`
    );
  }

  // TODO: redirect to payment success page.
  return redirect(
    `/payment/${peasydealOrderID}?payment_method=${PaymentMethod.Paypal}`,
  )
};
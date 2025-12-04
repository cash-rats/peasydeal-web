import { redirect } from 'react-router';

import type { PriceInfo } from '~/shared/cart';
import { PaymentMethod } from '~/shared/enums';

import { transformOrderDetail } from './utils';
import {
  createOrder,
  paypalCreateOrder,
  paypalCapturePayment,
} from './api.server';
import type {
  ShippingDetailFormType,
  ContactInfoFormType,
} from './types';

const parsePromoCode = (promoCode: string): string | null => {
  if (!promoCode) return null;
  try {
    return JSON.parse(promoCode);
  } catch (err) {
    return null;
  }
};

const parseCheckoutForms = (form: ActionPayload) => {
  const shippingFormObj: ShippingDetailFormType = JSON.parse(form.shipping_form);
  const contactInfoFormObj: ContactInfoFormType = JSON.parse(form.contact_info_form);
  const priceInfoObj: PriceInfo = JSON.parse(form.price_info);
  const cartItemsObj = JSON.parse(form.cart_items);

  return {
    shippingFormObj,
    contactInfoFormObj,
    priceInfoObj,
    cartItemsObj,
    parsedPromoCode: parsePromoCode(form.promo_code),
    paymentSecret: form.payment_secret,
  };
};

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
    shippingFormObj,
    contactInfoFormObj,
    priceInfoObj,
    cartItemsObj,
    parsedPromoCode,
    paymentSecret,
  } = parseCheckoutForms(form);
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
    payment_secret: paymentSecret,

    products: trfItemsObj,
    price_info: priceInfoObj,
    promo_code: parsedPromoCode,
  });

  return Response.json(resp);
}

export const __stripeCreateOrder = async (formObj: ActionPayload) => {
  const {
    shippingFormObj,
    contactInfoFormObj,
    priceInfoObj,
    cartItemsObj,
    parsedPromoCode,
    paymentSecret,
  } = parseCheckoutForms(formObj);

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
    payment_secret: paymentSecret,

    products: trfItemsObj,
    price_info: priceInfoObj,
    promo_code: parsedPromoCode,
  });

  const bodyText = await resp.text();
  let respJSON: any;
  try {
    respJSON = JSON.parse(bodyText);
  } catch (err) {
    respJSON = {
      error: 'invalid_json_response',
      message: 'Failed to parse create order response as JSON',
      raw: bodyText,
    };
  }
  // TODO: Refactor error handling after upgrading to newest remix version
  // throw new Response(JSON.stringify(respJSON), { status: resp.status });
  // return Response.json(respJSON, resp.status);
  return Response.json(respJSON, {
    status: resp.status,
  });
};

export const __paypalCapturePayment = async (paypalOrderID: string, peasydealOrderID: string) => {
  const resp = await paypalCapturePayment(paypalOrderID);
  const respJSON = JSON.parse(resp.capture_response);

  // TODO: redirect to paypal failed page.
  if (!respJSON.status || respJSON.status !== 'COMPLETED') {
    return Response.json(respJSON);
  }

  // TODO:
  //   - [x] redirect to payment success page.
  return redirect(
    `/payment/${peasydealOrderID}?payment_method=${PaymentMethod.Paypal}`,
  )
};

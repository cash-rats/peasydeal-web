import httpStatus from 'http-status-codes';

import type { ApiErrorResponse } from '~/shared/types';
import { envs } from '~/utils/get_env_source';
import type { PriceInfo } from '~/shared/cart';

type CreateOrderParams = {
  email: string;
  firstname: string;
  lastname: string;
  address1: string;
  address2: string;
  city: string;
  postal: string;
  payment_secret: string;
  products: any;
  contact_name: string;
  phone_value: string;
  price_info: PriceInfo;
  promo_code?: string;
}

export const createOrder = async ({
  email,
  firstname,
  lastname,
  address1,
  address2,
  city,
  postal,
  payment_secret,
  contact_name,
  phone_value,
  products,
  price_info,
  promo_code,
}: CreateOrderParams): Promise<Response> => {
  return fetch(`${envs.PEASY_DEAL_ENDPOINT}/v2/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      firstname,
      lastname,
      address: address1,
      address2,
      city,
      postal,
      payment_secret,
      contact_name,
      phone_value,
      products,
      price_info,
      promo_code,
    }),
  });
};

export type PaypalCreateOrderResponse = {
  order_uuid: string;
  paypal_order_id: string;
};

export const paypalCreateOrder = async (params: CreateOrderParams): Promise<PaypalCreateOrderResponse> => {
  const resp = await fetch(`${envs.PEASY_DEAL_ENDPOINT}/v2/orders/paypal-order`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...params,
      address: params.address1,
    })
  });

  const respJSON = await resp.json();
  if (resp.status !== httpStatus.OK) {
    const errResp = respJSON as ApiErrorResponse;
    throw new Error(errResp.err_msg);
  }

  return respJSON as PaypalCreateOrderResponse;
};

interface PaypalCapturePayment {
  capture_response: string;
}

export const paypalCapturePayment = async (paypalOrderID: string) => {
  const url = new URL(envs.PEASY_DEAL_ENDPOINT);
  url.pathname = '/v2/orders/paypal-capture-payment';

  const resp = await fetch(
    url.toString(),
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: paypalOrderID,
      }),
    }
  );

  const respJSON = await resp.json();
  if (resp.status !== httpStatus.OK) {
    throw new Error((respJSON as ApiErrorResponse).err_msg)
  };

  return respJSON as PaypalCapturePayment;
};
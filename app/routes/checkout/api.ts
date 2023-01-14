import { getPeasyDealEndpoint } from '~/utils/endpoints';
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
  return fetch(`${getPeasyDealEndpoint()}/v1/orders`, {
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
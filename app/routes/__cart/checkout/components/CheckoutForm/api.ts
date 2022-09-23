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
  contact_name: string,
  phone_value: string,
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
  products,
  contact_name,
  phone_value,
}: CreateOrderParams): Promise<Response> => {
  const { PEASY_DEAL_ENDPOINT } = process.env;
  return fetch(`${PEASY_DEAL_ENDPOINT}/v1/orders`, {
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
      products,
      contact_name,
      phone_value,
    }),
  });
};
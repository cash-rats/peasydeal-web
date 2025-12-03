export type OrderItem = {
  order_quantity: number,
  title: string,
  subtitle: string,
  description: string;
  spec_name: string;
  product_variation_uuid: string;
  sale_price: number;
  retail_price: number;

}

export type SuccessOrderDetail = {
  order_uuid: string;
  created_at: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  address: string;
  address2: string;
  postal: string;
  city: string;
  county: string;
  country: string;
  subtotal: number;
  shipping_fee: number;
  tax: number;
  total: number;
  order_items: OrderItem[];
};

export type TrackOrderProduct = {
  order_quantity: number;
  title: string;
  spec_name: string;
  retail_price: number;
  sale_price: number;
}

export type TrackOrder = {
  order_uuid: string;
  contact_name: string;
  address: string;
  address2: string;
  city: string;
  country: string;
  postalcode: string;
  shipping_status: string;
  total_amount: number;
  shipping_fee: number;
  tax_amount: number;
  discount_amount: number;
  created_at: string;
  parsed_created_at: Date;
  products: TrackOrderProduct[];
}

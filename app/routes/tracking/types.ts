export enum OrderStatus {
  OrderReceived = 'order_received',
  Processing = 'processing',
  Hold = 'hold',
  Complete = 'complete',
  Cancelled = 'cancelled',
};

export enum PaymentStatus {
  Unpaid = 'unpaid',
  Paid = 'paid',
  ReviewRefund = 'review_refund',
}

export type TrackOrderProduct = {
  order_quantity: number;
  title: string;
  spec_name: string;
  retail_price: number;
  sale_price: number;
  url: string;
  uuid: string;
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
  subtotal: number;
  total_amount: number;
  shipping_fee: number;
  tax_amount: number;
  discount_amount: number;
  created_at: string;
  parsed_created_at: Date;
  carrier: string;
  tracking_number: string;
  tracking_link: string;
  payment_status: PaymentStatus;
  products: TrackOrderProduct[];
  order_status: OrderStatus;
}

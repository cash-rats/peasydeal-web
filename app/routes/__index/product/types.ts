export interface ProductVariation {
  uuid: string;
  sku: string;
  spec_name: string;
  spec_content: string;
  short_description: string;
  retail_price: number;
  sale_price: number;
  shipping_fee: number;
  tax_rate: number;
  currency: string;
  discount: number;
  delivery_info: string;
};

export interface Category {
  id: number;
  name: string;
  is_main: boolean;
}

export interface ProductDetail {
  uuid: string;
  title: string;
  subtitle: string;
  default_variation_uuid: string;
  categories: Category[];
  images: string[];
  variations: ProductVariation[];
  description: string;
};
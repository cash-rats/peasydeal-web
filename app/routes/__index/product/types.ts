
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
  purchase_limit: number;
};

// TODO remove thie Category in favor of shared/types
export interface Category {
  id: number;
  name: string;
  label: string;
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
  order_count: number;
  rating: number;
  num_of_raters: number;
};

export type LoaderTypeProductDetail = {
  product: ProductDetail;
  canonical_url: string;
  meta_image: string;
};
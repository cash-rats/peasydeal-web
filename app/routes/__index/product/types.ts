
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

export interface ProductImg {
  variation_uuid: string;
  url: string;
};

export interface ProductDetail {
  uuid: string;
  title: string;
  subtitle: string;
  default_variation_uuid: string;
  categories: Category[];
  shared_images: ProductImg[];
  variation_images: ProductImg[];
  variations: ProductVariation[];
  description: string;
  seo_description: string;
  order_count: number;
  rating: number;
  num_of_raters: number;
  tag_combo_tags: string;
  main_pic_url?: ProductImg;
};

export type LoaderTypeProductDetail = {
  product: ProductDetail;
  canonical_url: string;
  meta_image: string;
};
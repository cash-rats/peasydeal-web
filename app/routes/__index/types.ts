import type { Product } from '~/shared/types';

export type ProductListInfo = {
  page: number;
  products: Product[];
  position: number;
};

export type CollectionProducts = {
  [key: string]: ProductListInfo;
};

export type ActivityItem = {
  variationUuid: string;
  productUuid: string;
  title: string;
  mainPic: string;
  retailPrice: number;
  salePrice: number;
  discountOff: number;
  currency: string;
  tag_combo_type: string;
}

export type ActivityBanner = {
  position: number;
  title: string;
  banner_url: string;
  items: ActivityItem[];
};
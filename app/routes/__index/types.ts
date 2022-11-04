import type { Product } from '~/shared/types';

export type ProductListInfo = {
  page: number;
  products: Product[];
  position: number;
};

export type CollectionProducts = {
  [key: string]: ProductListInfo;
};
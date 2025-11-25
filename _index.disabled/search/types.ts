import type { Product } from '~/shared/types';

export type SearchProductsDataType = {
  products: Product[];
  query: string;
  page: number;
  total: number;
  current: number;
  has_more: boolean;
};
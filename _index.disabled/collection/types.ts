import type { Product, TaxonomyWithParents } from '~/shared/types';

export interface LoaderDataType {
  products: Product[];
  category: TaxonomyWithParents;
  page: number;
  canonical_link: string;
  total: number;
  current: number;
  hasMore: boolean;
  userAgent: string;
}

export type LoadMoreDataType = {
  products: Product[],
  total: number;
  current: number;
  hasMore: boolean;
  category: string,
  page: number,
};

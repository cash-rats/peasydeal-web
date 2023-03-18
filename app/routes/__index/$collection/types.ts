import type { CategoriesMap, Product, TaxonomyCategory } from '~/shared/types';

export type LoaderDataType = {
  categories: CategoriesMap;
  products: Product[];
  category: TaxonomyCategory;
  page: number;
  canonical_link: string;
  total: number;
  current: number;
  hasMore: boolean;
};

export type LoadMoreDataType = {
  products: Product[],
  total: number;
  current: number;
  hasMore: boolean;
  category: string,
  page: number,
};

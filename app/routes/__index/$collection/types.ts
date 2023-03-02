import type { CategoriesMap, Product, Category } from '~/shared/types';

export type LoaderDataType = {
  categories: CategoriesMap;
  products: Product[];
  category: Category;
  page: number;
  canonical_link: string;
  navBarCategories: Category[];
  total: number;
  current: number;
  hasMore: boolean;
};

export type LoadMoreDataType = {
  products: Product[],
  total: number;
  current: number;
  hasMore: boolean;
  category: Category,
  page: number,
  navBarCategories: Category[];
};
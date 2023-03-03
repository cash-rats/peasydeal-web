import type {
  CategoriesMap,
  Product,
  Category,
} from '~/shared/types';

export type LoadProductsDataType = {
  categories: CategoriesMap;
  products: Product[];
  category: Category;
  page: number;
  canonical_link: string;
  total: number;
  current: number;
  hasMore: boolean;
};

export interface LoadMoreDataType {
  products: Product[],
  total: number;
  current: number;
  hasMore: boolean;
  category: Category,
  page: number,
}
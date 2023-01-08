export { fetchProductsByCategory, fetchProductsByCategoryV2 } from '~/routes/__index/api';
export type {
  FetchProductsByCategoryParams,
  FetchProductsByCategoryResponse,
  FetchProductsByCategoryV2Params,
} from '~/routes/__index/api';

export { fetchCategories, normalizeToMap } from './categories.server';
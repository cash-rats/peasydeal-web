export { fetchProductsByCategory, fetchProductsByCategoryV2 } from '~/routes/__index/api';
export type {
  FetchProductsByCategoryParams,
  FetchProductsByCategoryResponse,
  FetchProductsByCategoryV2Params,
} from '~/routes/__index/api';

export { searchProductPreviews } from '~/routes/hooks/auto-complete-search/api.server';
export type { SearchProductPreviewsParams } from '~/routes/hooks/auto-complete-search/api.server';

export { fetchCategories, normalizeToMap } from './categories.server';
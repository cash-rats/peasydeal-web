export { searchProductPreviews } from '~/routes/hooks/auto-complete-search/api.server';
export type { SearchProductPreviewsParams } from '~/routes/hooks/auto-complete-search/api.server';

export { fetchCategories } from './categories.server';
export * from './activate-email.server';
export { resolveCategoryName } from './resolve-category-name.server';
export {
  fetchProductsByCategoryV2,
  fetchActivityBanners,
  fetchLandingPageFeatureProducts,
  fetchContentfulPostWithId,
} from './products.server';
export type {
  FetchProductsByCategoryV2Params,
  IFetchLandingPageFeatureProductsParams,
} from './products.server';

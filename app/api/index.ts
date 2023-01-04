export { fetchProductsByCategory } from '~/routes/__index/api';
export type { FetchProductsByCategoryParams, FetchProductsByCategoryResponse } from '~/routes/__index/api';

export { fetchOrder } from '~/routes/checkout/result/components/Success/api';

export { fetchCategories, normalizeToMap } from './categories.server';
import type { LoaderFunctionArgs } from 'react-router';
import { fetchProductsByCategoryV2 } from '~/api/products';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const category = url.searchParams.get('category') || 'hot_deal';
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const perPage = parseInt(url.searchParams.get('per_page') || '16', 10);

  const result = await fetchProductsByCategoryV2({
    category,
    page,
    perpage: perPage,
  });

  return Response.json({
    items: result.items,
    total: result.total,
    hasMore: result.hasMore,
  });
};

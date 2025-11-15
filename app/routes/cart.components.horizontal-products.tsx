import { type LoaderFunctionArgs } from 'react-router';
import { fetchProductsByCategoryV2 } from '~/api/products';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const form = await request.formData();
  const formEntries = Object.fromEntries(form.entries());
  const catName = formEntries['cat_name'] as string || 'hot_deal';

  // Fetch top seller & new trend.
  const { items: recProds } = await fetchProductsByCategoryV2({
    category: catName,
    perpage: 12,
    random: true,
  });

  return Response.json({ recProds: recProds });
}

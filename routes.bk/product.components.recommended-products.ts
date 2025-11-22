import { data } from 'react-router';
import type { ActionFunctionArgs } from 'react-router';

import { fetchProductsByCategoryV2 } from '~/api/products';
import { PAGE_LIMIT } from '~/shared/constants';
import type { Product } from '~/shared/types';

type ActionDataType = {
  products: Product[];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const body = await request.formData();
  const category = (body.get('category') as string) || '';

  const { items: products } = await fetchProductsByCategoryV2({
    category,
    random: true,
    perpage: PAGE_LIMIT,
  });

  return data<ActionDataType>({ products });
};

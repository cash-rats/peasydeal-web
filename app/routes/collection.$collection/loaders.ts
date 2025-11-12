import { data } from 'react-router';
import httpStatus from 'http-status-codes';

import { fetchTaxonomyCategoryByName, checkCategoryExists } from '~/api/categories.server';
import { fetchProductsByCategoryV2 } from '~/api/products.server';
import { getCategoryProducts, addCategoryProducts } from '~/sessions/productlist.session';
import { commitSession } from '~/sessions/redis_session.server';
import { getCanonicalDomain } from '~/utils/seo';

import type { LoadMoreDataType, LoaderDataType } from './types';

interface ProductsLoaderParams {
  request: Request;
  category: string;
  perpage: number;
}

interface LoadMoreLoaderParams {
  request: Request;
  category: string;
  page: number;
  perpage: number;
}

export const productsLoader = async ({ request, category, perpage }: ProductsLoaderParams) => {
  if (!(await checkCategoryExists(category))) {
    throw data(
      {
        error: `target category ${category} not found`,
      },
      {
        status: httpStatus.NOT_FOUND,
      }
    );
  }

  const userAgent = request.headers.get('user-agent') || '';
  const [taxCat, cachedProds] = await Promise.all([
    fetchTaxonomyCategoryByName(category),
    getCategoryProducts(request, category),
  ]);

  if (cachedProds) {
    const { items: products, current, total, hasMore } = await fetchProductsByCategoryV2({
      perpage: perpage * cachedProds.page,
      page: 1,
      category,
      random: false,
    });

    return data<LoaderDataType>({
      category: taxCat,
      products,
      page: cachedProds.page,
      total,
      current,
      hasMore,
      canonical_link: `${getCanonicalDomain()}/collection/${category}`,
      userAgent,
    });
  }

  const { items: products, total, current, hasMore } = await fetchProductsByCategoryV2({
    perpage,
    page: 1,
    category,
  });

  const session = await addCategoryProducts(request, [], category, 1);

  return data<LoaderDataType>(
    {
      products,
      page: 1,
      total,
      current,
      hasMore,
      category: taxCat,
      canonical_link: `${getCanonicalDomain()}/collection/${category}`,
      userAgent,
    },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    }
  );
};

export const loadmoreProductsLoader = async ({
  request,
  category,
  page,
  perpage,
}: LoadMoreLoaderParams) => {
  if (!(await checkCategoryExists(category))) {
    throw data(`target category ${category} not found`, {
      status: httpStatus.NOT_FOUND,
    });
  }

  const { items: products, current, total, hasMore } = await fetchProductsByCategoryV2({
    perpage,
    page,
    category,
  });

  return data<LoadMoreDataType>(
    {
      products,
      total,
      current,
      hasMore,
      page,
      category,
    },
    {
      headers: {
        'Set-Cookie': await commitSession(
          await addCategoryProducts(request, [], category, page)
        ),
      },
    }
  );
};

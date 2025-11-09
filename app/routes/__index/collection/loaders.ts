import { data } from 'react-router';
import httpStatus from 'http-status-codes';

import {
  fetchTaxonomyCategoryByName,
  checkCategoryExists,
} from '~/api/categories.server';
import { getCategoryProducts, addCategoryProducts } from '~/sessions/productlist.session';
import { getCanonicalDomain } from '~/utils/seo';
import { commitSession } from '~/sessions/redis_session.server';

import { fetchProductsByCategoryV2 } from "../api";
import type { LoadMoreDataType, LoaderDataType } from './types';

interface ProductsLoaderParams {
  request: Request;
  category: string;
  perpage: number;
}


export const productsLoader = async ({
  request,
  category,
  perpage,
}: ProductsLoaderParams) => {
  if (!await checkCategoryExists(category)) {
    throw data({
      error: `target category ${category} not found`
    }, {
      status: httpStatus.NOT_FOUND
    });
  }

  const userAgent = request.headers.get('user-agent') || '';
  const [taxCat, cachedProds] = await Promise.all([
    await fetchTaxonomyCategoryByName(category),
    await getCategoryProducts(request, category),
  ]);

  if (cachedProds) {
    const {
      items: products,
      current,
      total,
      hasMore,
    } = await fetchProductsByCategoryV2({
      perpage: perpage * cachedProds.page,
      page: 1,
      category,
      random: false,
    })

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

  // First time loaded so it must be first page.
  const {
    items: products,
    total,
    current,
    hasMore,
  } = await fetchProductsByCategoryV2({
    perpage,
    page: 1,
    category,
  })

  const session = await addCategoryProducts(
    request,
    [],
    category,
    1,
  )

  return data<LoaderDataType>({
    products,
    page: 1,
    total,
    current,
    hasMore,
    category: taxCat,
    canonical_link: `${getCanonicalDomain()}/${category}`,
    userAgent,
  }, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

interface ILoaderMoreLoader {
  request: Request;
  category: string;
  page: number;
  perpage: number;
};


export const loadmoreProductsLoader = async ({
  request,
  category,
  page,
  perpage,
}: ILoaderMoreLoader) => {
  if (!await checkCategoryExists(category)) {
    throw data(`target category ${category} not found`, {
      status: httpStatus.NOT_FOUND
    });
  }

  const {
    items: products,
    current,
    total,
    hasMore,
  } = await fetchProductsByCategoryV2({
    perpage,
    page,
    category,
  })

  return data<LoadMoreDataType>({
    products,
    total,
    current,
    hasMore,
    page,
    category,
  }, {
    headers: {
      'Set-Cookie': await commitSession(
        await addCategoryProducts(
          request,
          [],
          category,
          page,
        ),
      ),
    },
  });
};
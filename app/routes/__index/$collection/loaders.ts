import { json } from '@remix-run/node';
import httpStatus from 'http-status-codes';

import { fetchCategoriesWithSplitAndHotDealInPlaced } from '~/api/categories.server';
import { normalizeToMap } from '~/api/categories.utils';
import { getCategoryProducts, addCategoryProducts } from '~/sessions/productlist.session';
import type { CategoriesMap, Product, Category } from '~/shared/types';
import { getCanonicalDomain } from '~/utils/seo';
import { commitSession } from '~/sessions/redis_session';

import { fetchProductsByCategoryV2 } from "../api";

interface IProductsLoader {
  request: Request;
  category: string;
  perpage: number;
}

interface LoaderDataType {
  categories: CategoriesMap;
  products: Product[];
  category: Category;
  page: number;
  canonical_link: string;
  navBarCategories: Category[];
  total: number;
  current: number;
  hasMore: boolean;
}

export const productsLoader = async ({
  request,
  category,
  perpage,
}: IProductsLoader) => {
  const [navBarCategories, categories] = await fetchCategoriesWithSplitAndHotDealInPlaced();
  const catMap = normalizeToMap([...categories, ...navBarCategories]);

  if (!catMap[category]) {
    throw json(`target category ${category} not found`, {
      status: httpStatus.NOT_FOUND
    });
  }

  const cachedProds = await getCategoryProducts(request, category);

  if (cachedProds) {
    const {
      items: products,
      current,
      total,
      hasMore,
    } = await fetchProductsByCategoryV2({
      perpage: perpage * cachedProds.page,
      page: 1,
      category: Number(catMap[category].catId),
      random: false,
    })

    return json<LoaderDataType>({
      categories: catMap,
      category: catMap[category],
      products,

      page: cachedProds.page,
      total,
      current,
      hasMore,

      navBarCategories,
      canonical_link: `${getCanonicalDomain()}/${category}`,
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
    category: Number(catMap[category].catId),
  })

  const session = await addCategoryProducts(
    request,
    [],
    category,
    1,
  )

  return json<LoaderDataType>({
    categories: catMap,
    products,
    page: 1,
    total,
    current,
    hasMore,
    category: catMap[category],
    navBarCategories,
    canonical_link: `${getCanonicalDomain()}/${category}`,
  }, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

interface LoaderMoreLoader {
  request: Request;
  category: string;
  page: number;
  perpage: number;
};

interface LoadMoreDataType {
  products: Product[],
  total: number;
  current: number;
  hasMore: boolean;
  category: Category,
  page: number,
  navBarCategories: Category[];
}

export const loadmoreProductsLoader = async ({
  request,
  category,
  page,
  perpage,
}: LoaderMoreLoader) => {
  const [navBarCategories, categories] = await fetchCategoriesWithSplitAndHotDealInPlaced();
  const catMap = normalizeToMap([...categories, ...navBarCategories]);

  if (!catMap[category]) {
    throw json(`target category ${category} not found`, httpStatus.NOT_FOUND);
  }

  const {
    items: products,
    current,
    total,
    hasMore,
  } = await fetchProductsByCategoryV2({
    perpage,
    page,
    category: Number(catMap[category].catId),
  })

  return json<LoadMoreDataType>({
    products,
    total,
    current,
    hasMore,
    category: catMap[category],
    page,
    navBarCategories,
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
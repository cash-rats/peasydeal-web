import { json } from '@remix-run/node';

import { getCategoryProducts, addCategoryProducts } from '~/sessions/productlist.session';
import { commitSession } from '~/sessions/sessions';
import { normalizeToMap, fetchPromotions } from '~/api/categories.server';
import type { CategoriesMap, Product, Category } from '~/shared/types';
import { getCanonicalDomain } from '~/utils/seo';

import { fetchPromotionProducts } from './api.server';

interface ILoadProducts {
  request: Request;
  page: number;
  perpage: number;
  promoName: string;
};

export type LoadProductsDataType = {
  categories: CategoriesMap;
  products: Product[];
  category: Category;
  page: number;
  canonical_link: string;
  total: number;
  current: number;
  hasMore: boolean;
};

export const loadProducts = async ({ request, page, perpage, promoName }: ILoadProducts) => {
  const promotions = await fetchPromotions();
  const catMap = normalizeToMap(promotions);
  const response: LoadProductsDataType = {
    categories: catMap,
    category: catMap[promoName],
    products: [],
    page: 1,
    total: 1,
    current: 1,
    hasMore: true,
    canonical_link: `${getCanonicalDomain()}/${promoName}`
  };

  const cachedInfo = await getCategoryProducts(request, promoName);

  if (cachedInfo) {
    const { items, total, current, hasMore } = await fetchPromotionProducts({
      promoName,
      perpage: perpage * cachedInfo.page,
      page: cachedInfo.page,
    });

    response.products = items;
    response.total = total;
    response.current = current;
    response.hasMore = hasMore;
    response.page = cachedInfo.page;

    return json<LoadProductsDataType>(response);
  }

  const {
    items: products,
    total,
    current,
    hasMore,
  } = await fetchPromotionProducts({
    promoName,
    perpage,
    page: 1,
  });

  const session = await addCategoryProducts(request, [], promoName, 1);

  response.products = products
  response.total = total;
  response.current = current;
  response.hasMore = hasMore

  return json(response, {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}

interface ILoadMoreProducts {
  request: Request,
  promoName: string,
  page: number,
  perpage: number,
}

export interface LoadMoreDataType {
  products: Product[],
  total: number;
  current: number;
  hasMore: boolean;
  category: Category,
  page: number,
}

export const loadMoreProducts = async ({ request, promoName, page, perpage }: ILoadMoreProducts) => {
  const {
    items: products,
    total,
    current,
    hasMore,
  } = await fetchPromotionProducts({
    promoName,
    page,
    perpage,
  });

  const promotions = await fetchPromotions();
  const catMap = normalizeToMap(promotions);

  return json<LoadMoreDataType>({
    products,
    total,
    current,
    hasMore,
    category: catMap[promoName],
    page
  }, {
    headers: {
      'Set-Cookie': await commitSession(
        await addCategoryProducts(request, [], promoName, page),
      ),
    }
  });
};
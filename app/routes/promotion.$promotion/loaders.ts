import httpStatus from 'http-status-codes';
import { data } from 'react-router';

import { getCategoryProducts, addCategoryProducts } from '~/sessions/productlist.session';
import { commitSession } from '~/sessions/redis_session.server';
import { fetchPromotions } from '~/api/categories.server';
import { normalizeToMap } from '~/api/categories.utils';
import { getCanonicalDomain } from '~/utils/seo';

import { fetchPromotionProducts } from './api.server';
import type { LoadProductsDataType, LoadMoreDataType } from './types';

interface LoadProductsArgs {
  request: Request;
  page: number;
  perpage: number;
  promoName: string;
}

export const loadProducts = async ({ request, perpage, promoName }: LoadProductsArgs) => {
  try {
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
      canonical_link: `${getCanonicalDomain()}/promotion/${promoName}`,
    };

    const cachedInfo = await getCategoryProducts(request, promoName);
    if (cachedInfo) {
      const { items, total, current, hasMore } = await fetchPromotionProducts({
        promoName,
        perpage: perpage * cachedInfo.page,
        page: 1,
      });

      return data<LoadProductsDataType>({
        ...response,
        products: items,
        total,
        current,
        hasMore,
        page: cachedInfo.page,
      });
    }

    const { items: products, total, current, hasMore } = await fetchPromotionProducts({
      promoName,
      perpage,
      page: 1,
    });

    const session = await addCategoryProducts(request, [], promoName, 1);

    return data<LoadProductsDataType>(
      {
        ...response,
        products,
        total,
        current,
        hasMore,
      },
      {
        headers: { 'Set-Cookie': await commitSession(session) },
      }
    );
  } catch (error) {
    throw Response.json({ error }, { status: httpStatus.NOT_FOUND });
  }
};

interface LoadMoreProductsArgs {
  request: Request;
  promoName: string;
  page: number;
  perpage: number;
}

export const loadMoreProducts = async ({ request, promoName, page, perpage }: LoadMoreProductsArgs) => {
  try {
    const { items: products, total, current, hasMore } = await fetchPromotionProducts({
      promoName,
      page,
      perpage,
    });

    const promotions = await fetchPromotions();
    const catMap = normalizeToMap(promotions);

    if (!catMap[promoName]) {
      throw new Error('promotion does not exist');
    }

    const session = await addCategoryProducts(request, [], promoName, page);

    return data<LoadMoreDataType>(
      {
        products,
        total,
        current,
        hasMore,
        category: catMap[promoName],
        page,
      },
      {
        headers: { 'Set-Cookie': await commitSession(session) },
      }
    );
  } catch (error) {
    throw Response.json({ error }, { status: httpStatus.NOT_FOUND });
  }
};

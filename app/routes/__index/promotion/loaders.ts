import { json } from '@remix-run/node';
import httpStatus from 'http-status-codes';

import { getCategoryProducts, addCategoryProducts } from '~/sessions/productlist.session';
import { commitSession } from '~/sessions/redis_session';
import { fetchPromotions } from '~/api/categories.server';
import { normalizeToMap } from '~/api/categories.utils';
import { getCanonicalDomain } from '~/utils/seo';

import { fetchPromotionProducts } from './api.server';
import type { LoadProductsDataType, LoadMoreDataType } from './types';

interface ILoadProducts {
  request: Request;
  page: number;
  perpage: number;
  promoName: string;
};

export const loadProducts = async ({ request, perpage, promoName }: ILoadProducts) => {
  try {

    const promotions = await fetchPromotions();
    const catMap = normalizeToMap(promotions);

    if (!catMap[promoName]) {
      throw new Error('promotion does not exist');
    }

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
        page: 1,
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
  } catch (error) {
    throw json(
      { error },
      { status: httpStatus.NOT_FOUND, }
    );
  }
}

interface ILoadMoreProducts {
  request: Request,
  promoName: string,
  page: number,
  perpage: number,
}

export const loadMoreProducts = async ({ request, promoName, page, perpage }: ILoadMoreProducts) => {
  try {
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

    if (!catMap[promoName]) {
      throw new Error('promotion does not exist');
    }

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
  } catch (error) {
    throw json(
      { error },
      { status: httpStatus.NOT_FOUND, }
    );
  }
};
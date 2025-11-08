import type { Session } from 'react-router';

import type { Product } from '~/shared/types';
import { getSession } from '~/sessions/redis_session';

export const ProductListKey = 'product_list';

export type ProductListInfo = {
  page: number;
  products: Product[];
};

export type CategoryProducts = {
  [key: string]: ProductListInfo;
};

const getCookieSession = async (request: Request): Promise<Session> => {
  return await getSession(request.headers.get("Cookie"));
}

export const setCategoryProducts = async (request: Request, category: string, products: Product[]): Promise<Session> => {
  const session = await getCookieSession(request);
  let prodMap: CategoryProducts = {};
  if (session.has(ProductListKey)) {
    prodMap = session.get(ProductListKey);
  }
  prodMap[category] = {
    page: 1,
    products
  }
  session.set(ProductListKey, prodMap);
  return session
}

export const addCategoryProducts = async (request: Request, products: Product[], category: string, page: number): Promise<Session> => {
  const session = await getCookieSession(request);
  if (!session.has(ProductListKey)) {
    session.set(ProductListKey, {
      [category]: { page: 1, products },
    })
    return session;
  }

  const prodMap = session.get(ProductListKey) as CategoryProducts;
  if (!prodMap[category]) {
    prodMap[category] = {
      page: 1,
      products,
    };
    session.set(ProductListKey, prodMap);
    return session;
  }

  prodMap[category] = {
    ...prodMap[category],
    products: prodMap[category].products.concat(products),
    page,
  }

  session.set(ProductListKey, prodMap);
  return session;
}

export const getCategoryProducts = async (request: Request, category: string): Promise<ProductListInfo | null> => {
  const session = await getCookieSession(request);
  if (!session.has(ProductListKey)) {
    return null;
  }

  const prodMap = session.get(ProductListKey);
  if (!prodMap[category]) {
    return null;
  }

  return prodMap[category];
}
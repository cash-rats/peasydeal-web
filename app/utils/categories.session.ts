import type { Session } from '@remix-run/node';

import type { Category } from '~/shared/types';

import { getCookieSession } from './session_utils';

export const CategoriesKey = 'categories_key';

export const setCategories = async (request: Request, categories: Category[]): Promise<Session> => {
  const session = await getCookieSession(request);
  session.set(CategoriesKey, categories);
  return session;
}

export const getCategories = async (request: Request): Promise<Category[] | null> => {
  const session = await getCookieSession(request);
  if (!session.has(CategoriesKey)) return null;
  return session.get(CategoriesKey);
}
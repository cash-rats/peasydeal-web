import type { Session } from '@remix-run/node';

import type { CategoriesMap } from '~/shared/types';

import { getCookieSession } from '../sessions/session_utils';

export const CategoriesKey = 'categories_key';

export const setCategories = async (request: Request, categories: CategoriesMap): Promise<Session> => {
  const session = await getCookieSession(request);
  session.set(CategoriesKey, categories);
  return session;
}

export const getCategories = async (request: Request): Promise<CategoriesMap | null> => {
  const session = await getCookieSession(request);
  if (!session.has(CategoriesKey)) return null;
  return session.get(CategoriesKey);
}
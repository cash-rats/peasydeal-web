import type { Session } from 'react-router';

import type { CategoriesMap } from '~/shared/types';

import { getCookieSession } from './session_utils.server';

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

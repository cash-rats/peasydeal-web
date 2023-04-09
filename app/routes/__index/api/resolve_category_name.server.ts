/*
  We've deprecated old categories like "home_appliances", "cloths_accessories"...
  Those categories already indexed on search engine master which casues index crawler
  not able to find corresponding category page.

  This API resolves equivalent taxonomy category name that is currently in use from the old category.
  We'll redirect to that taxonomy category when we find it different from old category name.
*/

import httpStatus from 'http-status-codes';

import { PEASY_DEAL_ENDPOINT } from '~/utils/get_env_source';

export const resolveCategoryName = async (categoryName: string): Promise<string> => {
  const url = new URL(PEASY_DEAL_ENDPOINT);
  url.pathname = '/v1/categories/resolve-category-name';
  url.searchParams.append('category_name', categoryName)

  const resp = await fetch(url.toString());
  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    throw new Error(JSON.stringify(respJSON));
  }

  return respJSON.name;
}
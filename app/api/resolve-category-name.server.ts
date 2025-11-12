import httpStatus from 'http-status-codes';

import { envs } from '~/utils/env';

export const resolveCategoryName = async (categoryName: string): Promise<string> => {
  const url = new URL(envs.PEASY_DEAL_ENDPOINT);
  url.pathname = '/v2/categories/resolve-category-name';
  url.searchParams.append('category_name', categoryName);

  const resp = await fetch(url.toString());
  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    throw new Error(JSON.stringify(respJSON));
  }

  return respJSON.name;
};

export default resolveCategoryName;

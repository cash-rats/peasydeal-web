import { getMYFBEndpoint } from '~/utils/endpoints';
import { PAGE_LIMIT } from '~/shared/constants';
import type { Product } from '~/shared/types';
import httpStatus from 'http-status-codes';

// data-server/ec/search?title=ear&pageNo=0&pageSize=10
// https://api.peasydeal.com:8443/data-server/ec/products?title=ear&pageNo=0&pageSize=10

type SearchProductsParams = {
  query: string;
  perpage?: number;
  page?: number;
};

export const searchProducts = async ({ query, perpage, page }: SearchProductsParams): Promise<Product[]> => {
  if (!perpage) perpage = PAGE_LIMIT;
  if (!page) page = 0;

  const endpoint = getMYFBEndpoint();
  const resp = await fetch(`${endpoint}/data-server/ec/products?title=${query}&pageNo=${page}&pageSize=${perpage}`);
  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    throw new Error(JSON.stringify(respJSON));
  }

  return respJSON.products;
};
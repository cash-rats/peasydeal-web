import { data } from 'react-router';
import httpStatus from 'http-status-codes';

import { composErrorResponse } from '~/utils/error';

import { searchProducts } from '../api/search_products.server';
import type { SearchProductsDataType } from './types';


interface SearchProductsParams {
  query: string;
  page: number;
  perPage: number;
};

export const searchProductsLoader = async ({
  query,
  page,
  perPage,
}: SearchProductsParams) => {
  try {
    const {
      products,
      total,
      current,
      has_more,
    } = await searchProducts({
      query,
      perpage: perPage,
      page,
    })

    if (products.length === 0) {
      throw data({ query }, { status: httpStatus.NOT_FOUND });
    }

    return data<SearchProductsDataType>({
      products,
      query,
      page,
      total,
      current,
      has_more,
    });
  } catch (e: any) {
    throw data({
      ...composErrorResponse(e.message),
      query,
    }, { status: httpStatus.NOT_FOUND });
  }
}

interface SearchMoreProductsParams {
  query: string;
  page: number;
  perPage: number;
};

export const searchMoreProductsLoader = async ({
  query,
  page,
  perPage,
}: SearchMoreProductsParams) => {
  try {
    const {
      products,
      total,
      current,
      has_more
    } = await searchProducts({
      query,
      perpage: perPage,
      page,
    });

    return data<SearchProductsDataType>({
      products,
      query,
      page,
      total,
      current,
      has_more,
    });
  } catch (e: any) {
    throw data(composErrorResponse(e.message));
  }
}
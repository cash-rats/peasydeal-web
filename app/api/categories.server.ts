import httpStatus from 'http-status-codes';

import { envs } from '~/utils/env';
import type { Category, TaxonomyWithParents } from '~/shared/types';
import type { CategoryType } from '~/shared/types';
import { ioredis as redis } from '~/redis.server';

import { splitNavBarCatsWithCatsInMore } from './categories.utils';

export const RedisCategoriesKey = 'categories';
export const RedisPromotionsKey = 'promotions';

const normalize = (cat: {
  category_id: number,
  label: string,
  name: string,
  desc: string,
  type: string,
  short_name: string,
  count: number,
  children: Category[],
}): Category => {
  return {
    label: cat.label,
    catId: cat.category_id,
    title: cat.label,
    description: cat.desc,
    name: cat.name,
    url: '',
    type: cat.type,
    shortName: cat.short_name,
    count: cat.count,
    children: cat.children || [],
  }
}

const normalizeAll = (cats: any) => cats.map(normalize);

interface ICategoriesFromServerResponse {
  categories: Category[];
  promotions: Category[];
  taxonomyCategories: Category[];
};


const fetchCategoriesFromServer = async (type?: CategoryType): Promise<ICategoriesFromServerResponse> => {
  const url = new URL(envs.PEASY_DEAL_ENDPOINT);
  url.pathname = '/v2/categories';
  if (type) {
    url.searchParams.append('type', type);
  }

  const resp = await fetch(url.toString());
  const respJSON = await resp.json();


  if (resp.status !== httpStatus.OK) {
    throw new Error(JSON.stringify(respJSON));
  }

  let categories: Category[] = [];
  let promotions: Category[] = [];
  let taxonomyCategories: Category[] = [];

  if (
    respJSON &&
    respJSON.categories &&
    Array.isArray(respJSON.categories)
  ) {
    categories = normalizeAll(respJSON.categories);
  }

  if (
    respJSON &&
    respJSON.promotions &&
    Array.isArray(respJSON.promotions)
  ) {
    promotions = normalizeAll(respJSON.promotions);
  }

  if (
    respJSON &&
    respJSON.taxonomy_categories &&
    Array.isArray(respJSON.taxonomy_categories)
  ) {
    taxonomyCategories = normalizeAll(respJSON.taxonomy_categories);
  }

  return {
    categories,
    promotions,
    taxonomyCategories,
  };
};


const hoistCategories = (categories: Category[]) => {
  const categoryToHoist = 'hot_deal';
  const topCategories = [
    'hot_deal',
    'new_trend',
    'electronic',
    'clothes_shoes',
    'home_appliances',
    'kitchen_kitchenware',
    'toy',
    'pet',
    'car_accessories',
  ];

  let hoisted: Array<Category> = [];
  const filteredCategory = categories.filter((category: Category) => {
    return topCategories.includes(category.name);
  });

  filteredCategory.forEach((category: Category) => {
    if (category.name === categoryToHoist) {
      hoisted = [category, ...hoisted];
    } else {
      hoisted.push(category);
    }
  });

  return hoisted;
}

const fetchCategories = async (): Promise<[Category[], Category[]]> => {
  // Retrieve categories from redis
  const catsstr = await redis.get(RedisCategoriesKey);

  // If it exists, return it.
  if (catsstr) {
    const cachesCats = JSON.parse(catsstr);
    const navBarCategories = hoistCategories(cachesCats);

    return [cachesCats, navBarCategories];
  }

  // If it doesn't exist, fetch from server and cache to redis.
  const { categories } = await fetchCategoriesFromServer('category');

  await redis.set(RedisCategoriesKey, JSON.stringify(categories));
  await redis.expire(RedisCategoriesKey, envs.CATEGORY_CACHE_TTL);

  const navBarCategories = hoistCategories(categories);

  return [categories, navBarCategories];
}

// TODO: cache promotions to redis.
const fetchPromotions = async (): Promise<Category[]> => {
  const { promotions } = await fetchCategoriesFromServer('promotion');
  return promotions;
};

const fetchCategoryByName = async (name: string): Promise<Category> => {
  const url = new URL(envs.PEASY_DEAL_ENDPOINT);
  url.pathname = `/v2/categories/${name}`
  const resp = await fetch(url.toString());
  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    throw new Error(JSON.stringify(respJSON));
  }

  return normalize(respJSON);
}

// Deprecated TODO: cache to redis.
const fetchCategoriesRegardlessType = (): Promise<ICategoriesFromServerResponse> => fetchCategoriesFromServer();

// TODO: cache to redis.
interface TaxonomyCategories {
  categories: Category[];
}

const fetchTaxonomyCategories = async (tier: number): Promise<TaxonomyCategories> => {
  const url = new URL(envs.PEASY_DEAL_ENDPOINT);
  url.pathname = '/v2/categories/taxonomy';
  url.searchParams.append('with_children', 'true');
  if (tier) {
    url.searchParams.append('tier', tier.toString());
  }
  const resp = await fetch(url.toString());
  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    throw new Error(JSON.stringify(respJSON));
  }

  return respJSON as TaxonomyCategories;
};

const fetchTaxonomyCategoryByName = async (name: string): Promise<TaxonomyWithParents> => {
  const url = new URL(envs.PEASY_DEAL_ENDPOINT);
  url.pathname = `/v2/categories/taxonomy/${name}`;

  const resp = await fetch(url.toString());
  const respJSON = await resp.json();
  if (resp.status !== httpStatus.OK) {
    throw new Error(JSON.stringify(respJSON));
  }

  return {
    ...normalize(respJSON),
    parents: normalizeAll(respJSON.parents),
    children: normalizeAll(respJSON.children),
  }
};

/*
  navCategory: [hotdeal, ...]
  categories: [...]
*/
const fetchCategoriesWithSplitAndHotDealInPlaced = async (): Promise<[Category[], Category[]]> => {
  const [hotDeal, tcats] = await Promise.all([
    await fetchCategoryByName('hot_deal'),
    await fetchTaxonomyCategories(1),
  ]);

  const [navBarCategories, categories] = splitNavBarCatsWithCatsInMore(normalizeAll(tcats.categories));
  navBarCategories.unshift(hotDeal);

  return [navBarCategories, [...navBarCategories, ...categories]];
}

const checkCategoryExists = async (name: string): Promise<boolean> => {
  const url = new URL(envs.PEASY_DEAL_ENDPOINT);
  url.pathname = `/v2/categories/${name}/exists`;

  const resp = await fetch(url.toString());
  const respJSON = await resp.json();

  if (resp.status === httpStatus.NOT_FOUND) {
    return false
  }

  if (resp.status !== httpStatus.OK) {
    throw new Error(JSON.stringify(respJSON));
  }

  const { exists } = respJSON;

  return exists as boolean;
}

export {
  fetchCategories,
  fetchPromotions,
  fetchCategoryByName,
  fetchCategoriesRegardlessType,

  fetchTaxonomyCategories,
  fetchCategoriesWithSplitAndHotDealInPlaced,
  fetchTaxonomyCategoryByName,
  checkCategoryExists,
};
import httpStatus from 'http-status-codes';

import { PEASY_DEAL_ENDPOINT } from '~/utils/get_env_source';
import type { Category, CategoriesMap } from '~/shared/types';
import { ioredis as redis } from '~/redis.server';
import { CATEGORY_CACHE_TTL } from '~/utils/get_env_source';

import { splitNavBarCatsWithCatsInMore } from './categories.utils';

export const RedisCategoriesKey = 'categories';
export const RedisPromotionsKey = 'promotions';

interface ICategoriesFromServerResponse {
  categories: Category[];
  promotions: Category[];
  taxonomyCategories: Category[];
};

enum CategoryType {
  promotion = "promotion",
  category = "category",
  taxonomy_category = "taxonomy_category",
};

const fetchCategoriesFromServer = async (type?: string): Promise<ICategoriesFromServerResponse> => {
  const url = new URL(PEASY_DEAL_ENDPOINT);
  url.pathname = '/v1/categories';
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
    categories = normalize(respJSON.categories);
  }

  if (
    respJSON &&
    respJSON.promotions &&
    Array.isArray(respJSON.promotions)
  ) {
    promotions = normalize(respJSON.promotions);
  }

  if (
    respJSON &&
    respJSON.taxonomy_categories &&
    Array.isArray(respJSON.taxonomy_categories)
  ) {
    taxonomyCategories = normalize(respJSON.taxonomy_categories);
  }

  return {
    categories,
    promotions,
    taxonomyCategories,
  };
};

const normalize = (cats: any) => {
  return cats.map((cat: { category_id: number, label: string, name: string, desc: string, type: string }): Category => {
    return {
      catId: cat.category_id,
      title: cat.label,
      description: cat.desc,
      name: cat.name,
      url: '',
      type: cat.type,
    }
  });
}

const normalizeToMap = (cats: Category[]): CategoriesMap => cats.reduce((prev, curr) => {
  return {
    ...prev,
    [curr.name]: curr,
  }
}, {})

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
  const { categories } = await fetchCategoriesFromServer(CategoryType.category);

  await redis.set(RedisCategoriesKey, JSON.stringify(categories));
  await redis.expire(RedisCategoriesKey, CATEGORY_CACHE_TTL);

  const navBarCategories = hoistCategories(categories);

  return [categories, navBarCategories];
}

// TODO: cache promotions to redis.
const fetchPromotions = async (): Promise<Category[]> => {
  const { promotions } = await fetchCategoriesFromServer(CategoryType.promotion);
  return promotions;
};

// TODO: cache to redis.
const fetchTaxonomyCategories = async (): Promise<Category[]> => {
  const { taxonomyCategories } = await fetchCategoriesFromServer(CategoryType.taxonomy_category);
  return taxonomyCategories;
};

/*
  navCategory: [hotdeal, ...]
  categories: [...]
*/
const fetchCategoriesWithSplitAndHotDealInPlaced = async (): Promise<[Category[], Category[]]> => {
  const [hotDeal, tcats] = await Promise.all([
    await fetchCategoryByName('hot_deal'),
    await fetchTaxonomyCategories(),
  ]);

  const [navBarCategories, categories] = splitNavBarCatsWithCatsInMore(tcats);
  navBarCategories.unshift(hotDeal);

  return [navBarCategories, categories];
}

const fetchCategoryByName = async (name: string): Promise<Category> => {
  const url = new URL(PEASY_DEAL_ENDPOINT);
  url.pathname = `/v1/categories/${name}`
  const resp = await fetch(url.toString());
  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    throw new Error(JSON.stringify(respJSON));
  }

  return {
    catId: respJSON.category_id,
    title: respJSON.label,
    description: respJSON.desc,
    name: respJSON.name,
    url: '',
    type: respJSON.type,
  }
}

// TODO: cache to redis.
const fetchCategoriesRegardlessType = (): Promise<ICategoriesFromServerResponse> => fetchCategoriesFromServer();

export {
  fetchCategories,
  fetchPromotions,
  fetchTaxonomyCategories,
  fetchCategoriesRegardlessType,
  fetchCategoryByName,
  fetchCategoriesWithSplitAndHotDealInPlaced,
  normalizeToMap,
};
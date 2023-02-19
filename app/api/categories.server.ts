import { PEASY_DEAL_ENDPOINT } from '~/utils/get_env_source';
import type { Category, CategoriesMap } from '~/shared/types';
import { ioredis as redis } from '~/redis.server';
import { CATEGORY_CACHE_TTL } from '~/utils/get_env_source';

export const RedisCategoriesKey = 'categories';

const fetchCategoriesFromServer = async (): Promise<Category[]> => {
  const resp = await fetch(`${PEASY_DEAL_ENDPOINT}/v1/categories`);
  const respJSON = await resp.json();
  let categories: Category[] = []

  if (respJSON && respJSON.categories && Array.isArray(respJSON.categories)) {
    categories = normalize(respJSON.categories);
  }

  return categories;
};

const normalize = (cats: any) => {
  return cats.map((cat: { category_id: number, label: string, name: string, desc: string }): Category => {
    return {
      catId: cat.category_id,
      title: cat.label,
      description: cat.desc,
      name: cat.name,
      url: '',
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
    return JSON.parse(catsstr);
  }

  // If it doesn't exist, fetch from server and cache to redis.
  const cats = await fetchCategoriesFromServer();

  await redis.set(RedisCategoriesKey, JSON.stringify(cats));
  await redis.expire(RedisCategoriesKey, CATEGORY_CACHE_TTL);

  const navBarCategories = hoistCategories(cats);

  return [cats, navBarCategories];
}

export { fetchCategories, normalizeToMap };
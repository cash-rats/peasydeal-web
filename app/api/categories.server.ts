import { PEASY_DEAL_ENDPOINT } from '~/utils/get_env_source';
import type { Category, CategoriesMap } from '~/shared/types';
import { ioredis as redis } from '~/redis.server';

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
  return cats.map((cat: { category_id: number, label: string, name: string }): Category => {
    console.log('debug normalize', cat);
    return {
      catId: cat.category_id,
      title: cat.label,
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

const fetchCategories = async (): Promise<Category[]> => {
  // Retrieve categories from redis
  const catsstr = await redis.get(RedisCategoriesKey);

  // If it exists, return it.
  if (catsstr) {
    return JSON.parse(catsstr);
  }

  // If it doesn't exist, fetch from server and cache to redis.
  const cats = await fetchCategoriesFromServer()
  await redis.set(RedisCategoriesKey, JSON.stringify(cats));

  return cats;
}


export { fetchCategories, normalizeToMap };
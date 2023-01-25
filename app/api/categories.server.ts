import { MYFB_ENDPOINT } from '~/utils/get_env_source';
import type { Category, CategoriesMap } from '~/shared/types';
import { ioredis as redis } from '~/redis.server';

export const RedisCategoriesKey = 'categories';

const fetchCategoriesFromServer = async (): Promise<Category[]> => {
  const resp = await fetch(`${MYFB_ENDPOINT}/data-server/ec/cat`);
  const respJSON = await resp.json();
  let categories: Category[] = []

  if (respJSON && respJSON.cats && Array.isArray(respJSON.cats)) {
    categories = normalize(respJSON.cats);
  }

  return categories;
};

const normalize = (cats: any) => {
  return cats.map((cat: { catId: number, title: string }): Category => {
    return {
      catId: cat.catId,
      title: cat.title,
      url: '',
    }
  });
}

const normalizeToMap = (cats: Category[]): CategoriesMap => cats.reduce((prev, curr) => {
  return {
    ...prev,
    [curr.title]: curr,
  }
}, {})

const fetchCategories = async (): Promise<Category[]> => {
  // Retrieve categories from redis
  const catsstr = await redis.get(RedisCategoriesKey);

  // If it exists, return it.
  if (catsstr) {
    return normalize(JSON.parse(catsstr));
  }

  // If it doesn't exist, fetch from server and cache to redis.
  const cats = await fetchCategoriesFromServer()
  await redis.set(RedisCategoriesKey, JSON.stringify(cats));

  return cats;
}


export { fetchCategories, normalizeToMap };
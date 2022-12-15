import { describe, it, expect } from 'vitest';

import { fetchCategories, RedisCategoriesKey } from './categories.server';
import { ioredis as redis } from '~/redis.server';

describe('share apis in application', () => {
  // TODO: should extract to vi env variable setup.
  beforeAll(() => {
    process.env.REDIST_PORT = import.meta.env.VITE_REDIS_PORT;
    process.env.REDIS_HOST = import.meta.env.VITE_REDIS_HOST;
    window.ENV = {}
    window.ENV.ENV = {
      MYFB_ENDPOINT: import.meta.env.VITE_MYFB_ENDPOINT,
    }
  })

  it('fetchCategoryList and caches to redis if key not exist in redis', async () => {
    const cats = await fetchCategories();
    const categoryKeyExists = await redis.exists(RedisCategoriesKey);
    expect(categoryKeyExists).toBeTruthy();
    expect(cats.length).toBeGreaterThan(0);
  });
});
import { describe, it, expect } from 'vitest';

import { ioredis as redis } from '~/redis.server';

import { fetchCategories, RedisCategoriesKey } from './categories.server';

describe('share apis in application', () => {
  it('fetchCategoryList and caches to redis if key not exist in redis', async () => {
    const cats = await fetchCategories();
    const categoryKeyExists = await redis.exists(RedisCategoriesKey);
    expect(categoryKeyExists).toBeTruthy();
    expect(cats.length).toBeGreaterThan(0);
  });
});
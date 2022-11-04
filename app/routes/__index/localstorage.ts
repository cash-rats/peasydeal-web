import type { CollectionProducts, ProductListInfo } from './types';

export const LocalStorageCategoryProductsKey = 'category_products';

export const getCategoryProductsMap = (): CollectionProducts => {
  const item = localStorage.getItem(LocalStorageCategoryProductsKey);
  if (!item) return {};
  return JSON.parse(item);
};

export const initProductListInfoIfNotExists = (map: CollectionProducts, category: string) => {
  if (!map[category]) {
    map[category] = {
      position: 0,
      page: 1,
      products: [],
    }
  }
};

export const getCategoryProductListInfoFromLocalStorage = (map: CollectionProducts, category: string): ProductListInfo => {
  return map[category] || {
    page: 1,
    products: [],
    position: 0,
  };
};

export const writeCategoryProductMapToLocalStorage = (map: CollectionProducts) => {
  localStorage.setItem(LocalStorageCategoryProductsKey, JSON.stringify(map));
};

export const removeCategoryProductMapFromLocalStorage = () => {
  localStorage.removeItem(LocalStorageCategoryProductsKey);
};
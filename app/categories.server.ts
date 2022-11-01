import { getMYFBEndpoint } from '~/utils/endpoints';
import type { Category, CategoriesMap } from '~/shared/types';

const fetchCategories = async (): Promise<Category[]> => {
  const resp = await fetch(`${getMYFBEndpoint()}/data-server/ec/cat`);
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


export { fetchCategories, normalizeToMap };
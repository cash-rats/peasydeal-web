// On 2023-03-15, we have about 23 top categories derived from our products.
// If we put all 23 taxonomy categories into category bar, it would blow up. Thus,
// we'll pick top 9 taxonomy categories to diplay in category bar and put the rest
// to More.
import type { Category, CategoriesMap } from '~/shared/types';

const splitNavBarCatsWithCatsInMore = (cats: Category[]): [Category[], Category[]] => {
  if (cats.length <= 9) return [cats, []];

  const catbarlist = cats.slice(0, 8);
  const catsinmore = cats.slice(8);

  return [catbarlist, catsinmore];
};

const normalizeToMap = (cats: Category[]): CategoriesMap => cats.reduce((prev, curr) => {
  return {
    ...prev,
    [curr.name]: curr,
  }
}, {})

export { splitNavBarCatsWithCatsInMore, normalizeToMap };
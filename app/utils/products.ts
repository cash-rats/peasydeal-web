import type { Product } from '~/shared/types';

const modToXItems = (prods: Product[], mod: number = 8): Product[][] => {
  const rows: Product[][] = [];
  let row: Product[] = [];

  if (prods.length === 0) return rows;

  if (prods.length < mod) {
    row = [...prods];
    rows.push(row);
    return rows;
  }

  for (let i = 0; i < prods.length; i++) {
    row.push(prods[i]);

    if ((row.length % mod) === 0) {
      rows.push(row);
      row = [];
    }
  }

  return rows;
};

export { modToXItems };

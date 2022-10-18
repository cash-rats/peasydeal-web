import type { Product } from '~/shared/types';

export const transformData = (apiData: any[]): Product[] => {
  const transformed: Product[] = apiData.map((data: any): Product => {
    return {
      currency: data.currency,
      description: data.description,
      discount: data.discountOff,
      main_pic: data.mainPic,
      productID: data.productId,
      retailPrice: data.retailPrice,
      salePrice: data.salePrice,
      shortDescription: data.shortDescription,
      subtitle: data.subTitle,
      title: data.title,
      variationID: data.variationId,
    };
  })

  return transformed;
}

// To render grid layout properly:
//  - 1 ~ 3 prods in layout 1
//  - 4 ~ 9 prods in layout 2,
//  we need to organize list of products in a format of 2 dimensional array:
//
//  [
//		[{}, {} ..., {}] <--- 9 prods each row.
//		[{}, {} ..., {}]
//  ]
//
// So that frontend only needs to consider 9 products for each iteration.
export const organizeTo9ProdsPerRow = (prods: Product[]): Product[][] => {
  const rows = [];
  let row = []

  if (prods.length < 9) {
    row = [...prods];
    rows.push(row);
    return rows;
  }

  for (let i = 0; i < prods.length; i++) {
    row.push(prods[i])
    if ((row.length % 9) === 0) {
      rows.push(row);
      row = [];
    }
  }

  return rows;
}
import type { Product } from '~/shared/types';
import type { ProductImg } from './product/types';

export const transformData = (apiData: any[]): Product[] => {
  const transformed: Product[] = apiData.map((data: any): Product => {
    return {
      currency: data.currency,
      description: data.description,
      discount: data.discountOff,
      main_pic: data.main_pic,
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
//		[{}, {} ..., {}] <--- 8 prods each row.
//		[{}, {} ..., {}]
//  ]
//
// So that frontend only needs to consider 9 products for each iteration.
export const modToXItems = (prods: Product[], mod: number = 8): Product[][] => {
  const rows: Product[][] = [];
  let row = []

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
}

/**
 * When a product is not assigned main image, we'll pick a main
 * image from shared images or, from variation images.
 */
type PickMainImageParams = {
  mainImg?: string | null | undefined | ProductImg;
  sharedImgs: any[];
  variationImgs: any[];
}

export const pickMainImage = ({ mainImg, sharedImgs, variationImgs }: PickMainImageParams): null | any => {
  if (mainImg) return mainImg;

  if (!sharedImgs) sharedImgs = [];
  if (!variationImgs) variationImgs = [];

  if (sharedImgs.length === 0 && variationImgs.length === 0) {
    return null
  }

  if (sharedImgs.length > 0) {
    return sharedImgs[0]
  }

  return variationImgs[0];
};
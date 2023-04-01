import type {
  WithContext,
  ListItem,
  Product as ProductSchema,
} from 'schema-dts';

import { composeProductDetailURL } from '~/utils';
import type { Product } from '~/shared/types';

export const composeBreadcrumbList = (baseURL: string, pathname: string): ListItem[] => {
  let pathsegments = baseURL;
  let position = 1;

  const baseItem: ListItem = {
    "@type": "ListItem",
    "position": position,
    "name": "Home",
    "item": pathsegments,
  };

  const listItems: ListItem[] = [baseItem];
  const pathparts = pathname
    .split('/')
    .filter(p => !!p);

  for (const pathpart of pathparts) {
    pathsegments = `${pathsegments}/${pathpart}`;
    position += 1;

    listItems.push({
      "@type": "ListItem",
      "position": position,
      "name": pathpart,
      "item": pathsegments,
    });
  }

  return listItems;
};

export const composeProductList = (prods: Product[]): WithContext<ProductSchema>[] => {
  const prodsSchemas: WithContext<ProductSchema>[] = [];

  if (!prods || Object.keys(prods).length === 0) return prodsSchemas;

  for (const prod of prods) {
    prodsSchemas.push({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": prod?.title,
      "image": prod?.main_pic,
      "description": prod?.description,
      "sku": prod?.sku,
      "offers": {
        "@type": "Offer",
        "price": prod?.salePrice.toString(),
        "priceCurrency": prod?.currency,
        "availability": "https://schema.org/InStock",
        "url": composeProductDetailURL({
          productName: prod?.title,
          productUUID: prod?.productUUID,
        })
      }
    });
  }

  return prodsSchemas;
}
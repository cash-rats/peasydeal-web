import type {
  WithContext,
  BreadcrumbList,
  ListItem,
  Product as ProductSchema,
} from 'schema-dts';
import type { StructuredDataFunction } from 'remix-utils';

import { getCanonicalDomain } from '~/utils/seo';
import { composeProductDetailURL } from '~/utils';

import type { Product } from '~/shared/types';

import type { LoaderDataType } from './types';

const composeBreadcrumbList = (baseURL: string, pathname: string): ListItem[] => {
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

const composeProductList = (prods: Product[]): WithContext<ProductSchema>[] => {
  const prodsSchemas: WithContext<ProductSchema>[] = [];

  for (const prod of prods) {
    prodsSchemas.push({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": prod.title,
      "image": prod.main_pic,
      "description": prod.description,
      "sku": prod.sku,
      "offers": {
        "@type": "Offer",
        "price": prod.salePrice.toString(),
        "priceCurrency": prod.currency,
        "availability": "https://schema.org/InStock",
        "url": composeProductDetailURL({
          productName: prod.title,
          variationUUID: prod.productUUID,
        })
      }
    });
  }

  return prodsSchemas;
}

const structuredData: StructuredDataFunction = ({
  data,
  params,
  location,
}) => {
  const loaderData: LoaderDataType = data;

  const { collection } = params;

  if (
    !loaderData ||
    !collection ||
    !loaderData.categories[collection]
  ) {
    return [];
  }

  const breadcrumbList: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": composeBreadcrumbList(
      getCanonicalDomain(),
      location.pathname,
    ),
  }

  const productList = composeProductList(loaderData.products);

  return [breadcrumbList, ...productList];
};

export default structuredData;
import type {
  WithContext,
  BreadcrumbList,
} from 'schema-dts';
import type { StructuredDataFunction } from 'remix-utils';

import { getCanonicalDomain } from '~/utils/seo';
import { composeBreadcrumbList, composeProductList } from '~/utils/structured_data';

import type { LoadProductsDataType } from './types';

const structuredData: StructuredDataFunction = ({
  data,
  params = {
    promotion: '',
  },
  location,
}) => {
  const loaderData: LoadProductsDataType = data;

  const { promotion } = params;

  if (
    !loaderData ||
    !promotion ||
    !loaderData?.categories ||
    Object.keys(loaderData.categories).length === 0
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
}

export default structuredData;
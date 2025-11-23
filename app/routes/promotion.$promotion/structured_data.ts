import type { WithContext, BreadcrumbList } from 'schema-dts';

import { getCanonicalDomain } from '~/utils/seo';
import { composeBreadcrumbList, composeProductList } from '~/utils/structured_data';

import type { LoadProductsDataType } from './types';

interface StructuredDataArgs {
  data?: LoadProductsDataType;
  params?: {
    promotion?: string;
  };
  location: {
    pathname: string;
  };
}

const structuredData = ({ data, params, location }: StructuredDataArgs) => {
  if (!data || !params?.promotion || !data.categories?.[params.promotion]) {
    return [];
  }

  const breadcrumbList: WithContext<BreadcrumbList> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: composeBreadcrumbList(getCanonicalDomain(), location.pathname),
  };

  const productList = composeProductList(data.products);

  return [breadcrumbList, ...productList];
};

export default structuredData;

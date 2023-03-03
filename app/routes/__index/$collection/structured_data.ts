import type {
  WithContext,
  BreadcrumbList,
} from 'schema-dts';
import type { StructuredDataFunction } from 'remix-utils';

import { getCanonicalDomain } from '~/utils/seo';
import { composeBreadcrumbList, composeProductList } from '~/utils/structured_data';

import type { LoaderDataType } from './types';

interface IStructuredData {
  data: LoaderDataType;
  params: {
    collection: string;
  };
  location: {
    pathname: string;
  };
}

const structuredData: StructuredDataFunction = ({
  data,
  params = {
    collection: '',
  },
  location,
}: IStructuredData) => {
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
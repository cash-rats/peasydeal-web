import type {
  WithContext,
  BreadcrumbList,
  ListItem,
} from 'schema-dts';
import type { StructuredDataFunction } from 'remix-utils';

import { getCanonicalDomain } from '~/utils/seo';

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
  const pathparts = pathname.split('/');

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

const structuredData: StructuredDataFunction = ({
  data,
  params,
  location,
}) => {
  const loaderData: LoaderDataType = data;
  const { collection } = params;

  if (
    !collection ||
    !loaderData.categories[collection]) {
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

  return [breadcrumbList];
};

export default structuredData;
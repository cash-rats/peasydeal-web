import type { WithContext, BreadcrumbList, ListItem } from 'schema-dts';

import type { LoaderDataType } from './types';

// {
//   "@context": "https://schema.org",
//   "@type": "BreadcrumbList",
//   "itemListElement": [{
//     "@type": "ListItem",
//     "position": 1,
//     "name": "Home",
//     "item": "https://www.example.com"
//   },{
//     "@type": "ListItem",
//     "position": 2,
//     "name": "Category",
//     "item": "https://www.example.com/category"
//   }]
// },
const structuredData = ({ data }) => {
  console.log('debug data', data);

  const breadcrumbList: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [],
  }

  //   "@context": "https://schema.org",
  //   "@type": "BreadcrumbList",

  return [breadcrumbList];
};

export default structuredData;
import type { StructuredDataFunction } from 'remix-utils';
import type { WithContext, WebSite } from 'schema-dts';

import { getCanonicalDomain } from '~/utils/seo';

const structuredData: StructuredDataFunction = () => {
  const scheme: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Peasy Deal",
    "url": getCanonicalDomain(),
    "description": "Make the smart choice - choose Peasy Deal over the competition!",
    "image": "https://storage.googleapis.com/peasydeal/logo/peasydeal_logo.svg",
    "sameAs": [],
  };

  return [scheme];
};

export default structuredData;
import type { LoaderTypeProductDetail } from './types';
import type { WithContext, Product } from 'schema-dts';
import { productsLoader } from '../$collection/loaders';

// @TODOs
//  - use product sku instead of uuid.
const structuredData = (data: LoaderTypeProductDetail) => {
  const { product } = data;

  const psd: WithContext<Product> =
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.images,
    "description": product.description,
    "sku": product.uuid,
    "review": {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": product.rating.toString(),
        "bestRating": "5"
      },
      "datePublished": "2022-01-01",
      "reviewBody": "Product review text"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.4",
      "reviewCount": "89"
    },
    "offers": {
      "@type": "Offer",
      "price": "19.99",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": "http://example.com/product"
    }
  };

  return psd;
};

export { structuredData }
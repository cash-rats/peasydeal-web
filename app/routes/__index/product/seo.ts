import type { LoaderTypeProductDetail } from './types';
import type { WithContext, Product } from 'schema-dts';


// @TODOs
//  - use product sku instead of uuid.
const structuredData = (data: LoaderTypeProductDetail) => {
  if (!data || !data.product) return {};

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
      "ratingValue": product.rating.toString(),
      "reviewCount": product.num_of_raters,
    },
    "offers": {
      "@type": "Offer",
      "price": product.variations.length > 0
        ? product.variations[0].sale_price.toString()
        : '0',
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock",
      "url": "http://example.com/product"
    }
  };

  return psd;
};

export { structuredData }
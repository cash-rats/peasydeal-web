import type { WithContext, Product } from 'schema-dts';

import type { LoaderTypeProductDetail } from './types';

// @TODOs
//  - use product sku instead of uuid.
const structuredData = (data: LoaderTypeProductDetail) => {
  if (
    !data ||
    !data.product ||
    !data.product.variations ||
    data.product.variations.length < 1
  ) {
    return {};
  };

  const { product } = data;
  const [firstVariation] = product.variations;

  const psd: WithContext<Product> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.main_pic_url?.url || '',
    "description": product.seo_description,
    "sku": firstVariation.sku,
    // TODO: We do not have product reivew feature yet. We'll enable "reiview" when the feature is implemented.
    // "review": {
    //   "@type": "Review",
    //   "reviewRating": {
    //     "@type": "Rating",
    //     "ratingValue": product.rating.toString(),
    //     "bestRating": "5"
    //   },
    //   "datePublished": "2022-01-01",
    //   "reviewBody": "Product review text"
    // },
    // "aggregateRating": {
    //   "@type": "AggregateRating",
    //   "ratingValue": product.rating.toString(),
    //   "reviewCount": product.num_of_raters,
    // },
    "offers": {
      "@type": "Offer",
      "price": firstVariation?.sale_price.toString() || '0',
      "priceCurrency": firstVariation.currency,
      "availability": "https://schema.org/InStock",
      "url": "http://example.com/product"
    }
  };

  return [psd];
};

export { structuredData }
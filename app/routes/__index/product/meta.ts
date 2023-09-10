import type { V2_MetaFunction } from '@remix-run/node';

import {
  getProdDetailTitleText,
  getProdDetailDescText,
  getProdDetailDescTextWithoutPrice,
  getProdDetailOgSEO,
  getFourOhFourTitleText,
  getFourOhFourDescText,
} from '~/utils/seo';

import type { ProductVariation, LoaderTypeProductDetail } from './types';
import { structuredData } from './structured_data';

export const meta: V2_MetaFunction = ({ data, matches }) => {
  data = data as LoaderTypeProductDetail;

  if (!data || !data.product) {
    return [
      { title: getFourOhFourTitleText('product') },
      {
        tagName: 'meta',
        name: 'description',
        content: getFourOhFourDescText('product'),
      }
    ];
  }

  const defaultVariation: ProductVariation | undefined = data.
    product.
    variations.
    find(variation => variation.uuid === data.product.default_variation_uuid);

  const category = data.product?.categories.length > 0 ? data.product.categories[0].label : '';
  let description = getProdDetailDescTextWithoutPrice(data.product.title, category);

  if (defaultVariation) {
    description = getProdDetailDescText(
      data.product.title,
      defaultVariation.retail_price,
      defaultVariation.sale_price,
      category,
    )
  }

  return [
    { title: getProdDetailTitleText(data.product.title, data.product.uuid) },
    {
      tagName: 'meta',
      name: 'description',
      content: description,
    },
    { 'script:ld+json': structuredData(data) },
    ...getProdDetailOgSEO({
      title: getProdDetailTitleText(data.product.title, data.product.uuid),
      desc: description,
      image: data.meta_image,
      url: data.canonical_url,
    })
  ];
};
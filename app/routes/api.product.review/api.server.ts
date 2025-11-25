import httpStatus from 'http-status-codes';

import { envs } from '~/utils/env';

interface SubmitReviewParams {
  product_uuid: string;
  order_uuid: string;
  name: string;
  masked_name: string;
  rating: number;
  review: string;
  image_links: string[];
};

const submitReview = async (params: SubmitReviewParams) => {
  const url = new URL(envs.PEASY_DEAL_ENDPOINT);
  url.pathname = `/v2/products/${params.product_uuid}/review`;
  const resp = await fetch(url.toString(), {
    method: 'POST',
    body: JSON.stringify({
      name: params.name,
      masked_name: params.masked_name,
      order_uuid: params.order_uuid,
      review: params.review,
      rating: params.rating,
      links: params.image_links,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    throw new Error(JSON.stringify(respJSON));
  }

  return respJSON;
};

export { submitReview };

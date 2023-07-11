import httpStatus from 'http-status-codes';

import { PEASY_DEAL_ENDPOINT } from '~/utils/get_env_source';

interface SubmitReviewParams {
  product_uuid: string;
  order_uuid: string;
  rating: number;
  review: string;
  image_links: string[];
};

const submitReview = async (params: SubmitReviewParams) => {
  console.log('debut 1 submitReview', params)

  const url = new URL(PEASY_DEAL_ENDPOINT);
  url.pathname = `/v1/products/${params.product_uuid}/review`;
  const resp = await fetch(url.toString(), {
    method: 'POST',
    body: JSON.stringify({
      order_uuid: params.order_uuid,
      review: params.review,
      rating: params.rating,
      links: params.image_links,
    }),
    headers: { 'Content-Type': "application/json" },
  })

  const respJSON = await resp.json();

  if (resp.status !== httpStatus.OK) {
    throw new Error(JSON.stringify(respJSON));
  }

  return respJSON;
};

export { submitReview };
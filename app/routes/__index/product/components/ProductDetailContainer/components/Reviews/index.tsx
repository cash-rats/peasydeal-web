import { useEffect } from 'react';
import type { ActionFunction } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';

import Review from './components/Review';
import { fetchReviews } from '../../api.server';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const prodUUID = await formData.get('product_uuid') as string || '';
  if (!prodUUID) return null
  const reviews = await fetchReviews(prodUUID);
  console.log('debug triggered !!!8* ', reviews);
  return null
}

interface ReviewsParams {
  productUUID: string
}

function Reviews({ productUUID }: ReviewsParams) {
  const fetcher = useFetcher();

  useEffect(() => {
    fetcher.submit({
      product_uuid: productUUID,
    }, {
      method: 'post',
      action: '/product/components/ProductDetailContainer/components/Reviews?index',
    });
  }, [productUUID]);

  return (
    <div>
      <h3 className="
        font-poppins font-bold text-2xl mt-6 lg:px-2
      ">
        Reviews
      </h3>

      {/* rating grids */}
      <div className="flex flex-col">
        <Review text='Very friendly and on time. Very efficient, also takes very nice photos. Easy to talk to, very fluent in English. Highly recommended. Will definitely tell my family and friends about the wonderful experience.' />
        <Review text='Jia Xin is a very friendly driver and he takes the time to give us information about the place we pass by during the ride. He is very patient and passionate about his job, which makes the whole experience even more worthwhile!😆apart from all of the above, the journey went smoothly and the ride was' />
        <Review text='Jia Xin is a very friendly driver and he takes the time to give us information about the place we pass by during the ride. He is very patient and passionate about his job, which makes the whole experience even more worthwhile!😆apart from all of the above, the journey went smoothly and the ride was' />
        <Review text='Jia Xin is a very friendly driver and he takes the time to give us information about the place we pass by during the ride. He is very patient and passionate about his job, which makes the whole experience even more worthwhile!😆apart from all of the above, the journey went smoothly and the ride was' />
      </div>
    </div>
  );
}

export default Reviews;
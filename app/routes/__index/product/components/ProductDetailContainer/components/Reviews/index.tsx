import { useEffect, useState, useMemo } from 'react';
import { json } from '@remix-run/node';
import type { ActionFunction } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';

import Review from './components/Review';
import ReviewSkeleton from './components/ReviewSkeleton';
import ReviewAggregate from './components/ReviewAggregate';
import type { ReviewResponse } from '../../types';
import { fetchReviews } from '../../api.server';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const prodUUID = await formData.get('product_uuid') as string || '';
  if (!prodUUID) return null
  const resp = await fetchReviews(prodUUID);
  return json<ReviewResponse>(resp);
}

interface ReviewsParams {
  productUUID: string
}

function Reviews({ productUUID }: ReviewsParams) {
  const [reviewInfo, setReviewInfo] = useState<ReviewResponse | null>(null);
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.type === 'done') {
      setReviewInfo(fetcher.data)
    }
  }, [fetcher.type]);

  useEffect(() => {
    fetcher.submit({
      product_uuid: productUUID,
    }, {
      method: 'post',
      action: '/product/components/ProductDetailContainer/components/Reviews?index',
    });
  }, [productUUID]);

  const getReviewsHelper = useMemo(() => {
    if (fetcher.state === 'idle' && reviewInfo) {
      if (reviewInfo.reviews.length > 0) {
        return (
          <>
            <div className="w-full mb-3">
              <ReviewAggregate averageRating={reviewInfo.average_rating} numberOfRaters={reviewInfo.number_of_raters} />
            </div>

            {
              reviewInfo.reviews.map((review, index) => (
                <Review
                  key={index}
                  name={review.reviewer_name}
                  text={review.content}
                  rating={review.rating}
                  timestamp={review.review_date}
                />
              ))
            }
          </>
        );
      }

      if (reviewInfo.reviews.length === 0) {
        return (
          <div className="
    						w-full py-2.5 max-w-screen-xl mx-auto
    						capitalized
    						text-lg font-poppins nowrap
    						flex items-center justify-center
    						bg-white
    						p-4 mt-6
    					">
            <span>
              <p className='text-[#000] font-poppins first-letter:capitalize'>no reviews yet</p>
            </span>
          </div>
        );
      }
    }

    return (<ReviewSkeleton />)

  }, [
    fetcher.state,
    reviewInfo,
  ])

  return (
    <div>
      <h3 className="font-poppins font-bold text-2xl mt-6 mb-3 lg:pr-2">
        Reviews
      </h3>

      <div className="flex flex-col">
        {getReviewsHelper}
      </div>
    </div>
  );
}

export default Reviews;
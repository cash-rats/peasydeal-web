import { unstable_parseMultipartFormData } from '@remix-run/node';

import { uploadHandler } from './storage.server';
import { submitReview } from './api.server';

// 1. Upload review images
//     - allow only jpeg & png image upload
// 2. Submit review info
const reviewProduct = async (request: Request) => {
  try {
    // upload files to gcs.
    const formData = await unstable_parseMultipartFormData(
      request,
      uploadHandler,
    );

    // submit reviews to server.
    const imgs = formData.getAll('images') as string[];
    const review = formData.get('review') as string;
    const rating = formData.get('rating') as string || '0';
    const prodUUID = formData.get('product_uuid') as string;
    const orderUUID = formData.get('order_uuid') as string;

    await submitReview({
      product_uuid: prodUUID,
      order_uuid: orderUUID,
      rating: parseFloat(rating),
      review,
      image_links: imgs,
    });
  } catch (err: any) {
    console.log('debug err', err);
  }
  return null;
};

export { reviewProduct };
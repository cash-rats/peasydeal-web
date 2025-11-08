import { parseMultipartFormData, json } from 'react-router';

import { composErrorResponse } from '~/utils/error';

import type { FormError } from './types';
import { uploadHandler } from './storage.server';
import { submitReview } from './api.server';
import { maskName } from '../../../../utils';

const validateReview = (review: string) => {
  if (review.length === 0) {
    return 'review content can not be empty';
  }

  if (review.length > 100) {
    return 'please limit your review content in 100 characters';
  }
  return '';
};

const validateName = (name: string) => {
  if (name.length === 0) {
    return 'name is required';
  }

  return '';
}

type ValidateFormParams = {
  review: string;
  name: string;
};

const validateForm = ({ review, name }: ValidateFormParams) => {
  const formError: FormError = {
    review: validateReview(review),
    name: validateName(name),
  }
  return formError;
}

// 1. Upload review images
//     - allow only jpeg & png image upload
// 2. Submit review info
const reviewProduct = async (request: Request) => {
  try {
    // upload files to gcs.
    const formData = await parseMultipartFormData(
      request,
      uploadHandler,
    );

    // submit reviews to server.
    const imgs = formData.getAll('images') as string[];
    const name = formData.get('name') as string || '';
    const review = formData.get('review') as string || '';
    const rating = formData.get('rating') as string || '0';
    const prodUUID = formData.get('product_uuid') as string;
    const orderUUID = formData.get('order_uuid') as string;

    // validate form data
    const formError = validateForm({ review, name });
    if (Object.values(formError).some(e => !!e)) {
      return json(composErrorResponse(formError, 'validation_error'));
    }

    await submitReview({
      product_uuid: prodUUID,
      order_uuid: orderUUID,
      rating: parseFloat(rating),
      review,
      image_links: imgs,
      name,
      masked_name: maskName(name),
    });

    return {};
  } catch (err: any) {
    return json(composErrorResponse(err.message));
  }
};

export { reviewProduct, validateForm };
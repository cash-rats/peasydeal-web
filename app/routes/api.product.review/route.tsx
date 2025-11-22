import { parseFormData } from '@remix-run/form-data-parser';
import { data, type ActionFunctionArgs } from 'react-router';

import { composErrorResponse } from '~/utils/error';
import { maskName } from '~/routes/tracking/utils';

import type { FormError } from './type';
import { uploadHandler } from './storage.server';
import { submitReview } from './api.server';

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
};

type ValidateFormParams = {
  review: string;
  name: string;
};

const validateForm = ({ review, name }: ValidateFormParams) => {
  const formError: FormError = {
    review: validateReview(review),
    name: validateName(name),
  };
  return formError;
};

const handleReviewSubmission = async (request: Request) => {
  try {
    const formData = await parseFormData(request, uploadHandler);

    const imgs = formData.getAll('images') as string[];
    const name = (formData.get('name') as string) || '';
    const review = (formData.get('review') as string) || '';
    const rating = (formData.get('rating') as string) || '0';
    const prodUUID = formData.get('product_uuid') as string;
    const orderUUID = formData.get('order_uuid') as string;

    const formError = validateForm({ review, name });
    if (Object.values(formError).some((err) => !!err)) {
      return data(composErrorResponse(formError, 'validation_error'));
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
    return data(composErrorResponse(err.message));
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return data(composErrorResponse('Method Not Allowed'));
  }

  return handleReviewSubmission(request);
};

export { validateForm };

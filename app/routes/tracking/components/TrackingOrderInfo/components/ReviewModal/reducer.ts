import type { ImmerReducer } from 'use-immer';
import type { ImageListType } from 'react-images-uploading';

import type { FormError } from './types';
import type { LoadingState } from './types';

interface StateShape {
  loadingState: LoadingState;
  error: string | null;
  formError: FormError | null;
  name: string;
  rating: number;
  review: string;
  images: ImageListType;
}

export enum ReviewModalActionTypes {
  set_error = 'set_error',
  set_form_error = 'set_form_error',
  update_name = 'update_name',
  update_rating = 'update_rating',
  update_review = 'update_review',
  update_images = 'update_images',
  update_loading_status = 'update_loading_status',
  reset = 'reset',
};

interface ReviewModalActions {
  type: ReviewModalActionTypes;
  payload: number
  | string
  | null
  | ImageListType
  | FormError
  | LoadingState
};

// action creators
export const setError = (error: string | null) => ({
  type: ReviewModalActionTypes.set_error,
  payload: error,
});

export const setFormError = (formError: FormError | null) => ({
  type: ReviewModalActionTypes.set_form_error,
  payload: formError,
})

export const updateRating = (rating: number) => ({
  type: ReviewModalActionTypes.update_rating,
  payload: rating
});

export const updateName = (name: string) => ({
  type: ReviewModalActionTypes.update_name,
  payload: name,
})

export const updateReview = (review: string) => ({
  type: ReviewModalActionTypes.update_review,
  payload: review
});

export const updateImages = (images: ImageListType) => ({
  type: ReviewModalActionTypes.update_images,
  payload: images,
});

export const updateLoadingState = (state: LoadingState) => ({
  type: ReviewModalActionTypes.update_loading_status,
  payload: state,
});

export const reset = () => ({
  type: ReviewModalActionTypes.reset,
  payload: null,
})

const reducer: ImmerReducer<StateShape, ReviewModalActions> = (draft, action) => {
  switch (action.type) {
    case ReviewModalActionTypes.update_rating: {
      const rating = action.payload as number;
      draft.rating = rating;
      break;
    }
    case ReviewModalActionTypes.update_review: {
      const review = action.payload as string;
      draft.review = review;
      break;
    }
    case ReviewModalActionTypes.update_images: {
      const images = action.payload as ImageListType[];
      draft.images = images;
      break;
    }
    case ReviewModalActionTypes.set_form_error: {
      const formErr = action.payload as FormError;
      draft.formError = formErr;
      break;
    }
    case ReviewModalActionTypes.set_error: {
      const error = action.payload as string | null;
      draft.error = error;
      break;
    }
    case ReviewModalActionTypes.update_loading_status: {
      const state = action.payload as LoadingState;
      draft.loadingState = state;
      break;
    }
    case ReviewModalActionTypes.update_name: {
      const name = action.payload as string;
      draft.name = name;
      break;
    }
    case ReviewModalActionTypes.reset: {
      draft.images = [];
      draft.review = '';
      draft.name = '';
      draft.error = null;
      draft.formError = null;
      draft.loadingState = 'init';

      break;
    }
    default:
      break;
  }
};

export default reducer;
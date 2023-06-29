import type { ImmerReducer } from 'use-immer';
import type { ImageListType } from 'react-images-uploading';

interface StateShape {
  rating: number;
  review: string;
  images: ImageListType;
}

export enum ReviewModalActionTypes {
  update_rating = 'update_rating',
  update_review = 'update_review',
  update_images = 'update_images',
};

interface ReviewModalActions {
  type: ReviewModalActionTypes;
  payload: number | string | ImageListType;
};

// action creators
export const updateRating = (rating: number) => ({
  type: ReviewModalActionTypes.update_rating,
  payload: rating
});

export const updateReview = (review: string) => ({
  type: ReviewModalActionTypes.update_review,
  payload: review
});

export const updateImages = (images: ImageListType) => ({
  type: ReviewModalActionTypes.update_images,
  payload: images,
});


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
      break
    }
    default:
      break;
  }
};

export default reducer;
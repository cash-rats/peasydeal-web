import { useEffect } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '@chakra-ui/react';
import { useImmerReducer } from 'use-immer';
import styles from '@smastrom/react-rating/style.css';
import type { LinksFunction, ActionFunction } from '@remix-run/node';
import type { ImageListType } from 'react-images-uploading';
import { useFetcher } from '@remix-run/react';

import type { FormError } from './types';
import ReviewForm from './components/ReviewForm';
import ReviewSuccess, { links as ReviewSuccessStyles } from './components/ReviewSuccess';
import { reviewProduct } from './actions';
import reducer, {
  updateRating,
  updateReview,
  updateImages,
  reset,
  uploadLoadingState,
  LoadingState,
  setFormError,
  setError,
} from './reducer';
import type { TrackOrderProduct } from '../../../../types';

export const links: LinksFunction = () => {
  return [
    ...ReviewSuccessStyles(),
    { rel: 'stylesheet', href: styles },
  ];
};

interface ReviewModalParams {
  isOpen: boolean;
  onClose: () => void;
  orderUUID: string;
  reviewProduct: TrackOrderProduct | null;
}


export const action: ActionFunction = async ({ request }) => {
  return reviewProduct(request);
};

/**
 * Product review modal. This modal should contain:
 *
 * - [x] Display error alert when form validation failed
 * - [x] Form validation.
 * - [x] Ratable stars. 5 stars, default 3 stars
 * - [x] Textarea for inputting comments. max 100 words
 * - [x] image upload. max 2 images
 * - [ ] submit button should remove images.
 * - [ ] remove images when review panel is closed.
 */
function ReviewModal({
  isOpen,
  onClose,
  orderUUID,
  reviewProduct,
}: ReviewModalParams) {
  const [state, dispatch] = useImmerReducer(reducer, {
    loadingState: LoadingState.INIT,
    error: null,
    formError: null,
    review: '',
    rating: 3,
    images: [],
  });

  const reviewFetcher = useFetcher();

  const handleChangeRating = (num: number) =>
    dispatch(updateRating(num));
  const handleChangeReview = (elm: ChangeEvent<HTMLTextAreaElement>) =>
    dispatch(updateReview(elm.target.value))
  const handleChangeImage = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined,
  ) => {
    dispatch(updateImages(imageList));
  }
  const handleSubmit = (evt: MouseEvent<HTMLButtonElement>) => {
    if (!reviewProduct) return;

    const formData = new FormData();

    // append 'rating' and 'comments'
    formData.append('rating', state.rating.toString());
    formData.append('review', state.review);
    formData.append('product_uuid', reviewProduct.uuid)
    formData.append('order_uuid', orderUUID)

    // append 'images'
    for (const image of state.images) {
      formData.append('images', image.file);
    }

    reviewFetcher.submit(formData, {
      method: 'post',
      action: '/tracking/components/TrackingOrderInfo/components/ReviewModal?index',
      encType: 'multipart/form-data',
    });
  };

  useEffect(() => {
    if (!isOpen) {
      dispatch(reset());
    }
  }, [isOpen]);

  // Remove all images from image uploader
  useEffect(() => {
    if (reviewFetcher.type === 'done') {
      const data = reviewFetcher.data;
      if (data?.err_code) {
        data.err_code === 'validation_error'
          ? dispatch(setFormError(data.err_msg as FormError))
          : dispatch(setError(data.err_msg as string));

        dispatch(uploadLoadingState(LoadingState.FAILED))

        return
      }

      // submit success, display success check
      // close current modal, display checkmark
      dispatch(uploadLoadingState(LoadingState.DONE))
    }

  }, [reviewFetcher.type]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='xl'
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        {
          reviewProduct
            ? (
              <ModalHeader>
                <p className="font-poppins font-bold text-lg">
                  {
                    state.loadingState === LoadingState.INIT ||
                      state.loadingState === LoadingState.FAILED
                      ? 'add a review'
                      : null
                  }

                  {
                    state.loadingState === LoadingState.INIT
                      ? 'review success'
                      : null
                  }

                </p>

                <ModalBody className="pl-0 pr-0">
                  {/* {
                    state.loadingState === LoadingState.INIT ||
                      state.loadingState === LoadingState.FAILED
                      ? (
                        <ReviewForm
                          error={state.error}
                          formError={state.formError}
                          rating={state.rating}
                          reviewProduct={reviewProduct}
                          images={state.images}
                          onClose={onClose}
                          onChangeRating={handleChangeRating}
                          onChangeReview={handleChangeReview}
                          onChangeImage={handleChangeImage}
                          onSubmit={handleSubmit}
                        />
                      )
                      : null
                  } */}

                  {/* {
                    state.loadingState === LoadingState.DONE
                      ? (
                        <div>
                          done
                        </div>
                      )
                      : null
                  } */}

                  <ReviewSuccess />
                </ModalBody>
              </ModalHeader>
            )
            : null
        }
      </ModalContent>
    </Modal>
  );
}

export default ReviewModal;
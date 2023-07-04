import { useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Textarea,
  IconButton,
  Button,
} from '@chakra-ui/react';
import { useImmerReducer } from 'use-immer';
import Image, { MimeType } from 'remix-image';
import { Rating, RoundedStar } from '@smastrom/react-rating';
import styles from '@smastrom/react-rating/style.css';
import type { LinksFunction, ActionFunction } from '@remix-run/node';
import ImageUploading from 'react-images-uploading';
import type { ImageListType } from 'react-images-uploading';
import { RxCross1 } from 'react-icons/rx';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import { BiInfoCircle } from 'react-icons/bi';
import { useFetcher, useNavigation } from '@remix-run/react';

import { DOMAIN } from '~/utils/get_env_source';

import { reviewProduct } from './actions';
import reducer, {
  updateRating,
  updateReview,
  updateImages,
} from './reducer';
import { MaxImageNumber } from '../../constants';
import type { TrackOrderProduct } from '../../../../types';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

interface ReviewModalParams {
  isOpen: boolean;
  onClose: () => void;
  orderUUID: string;
  reviewProduct: TrackOrderProduct | null;
}


export const action: ActionFunction = async ({ request }) => {
  return reviewProduct(request)
};

/**
 * Product review modal. This modal should contain:
 *
 * - [ ] Ratable stars. 5 stars
 * - [ ] Textarea for inputting comments. max 150 words
 * - [ ] image upload. max 1 image
 * - [ ] close, submit button
 */
function ReviewModal({
  isOpen,
  onClose,
  orderUUID,
  reviewProduct,
}: ReviewModalParams) {
  const [state, dispatch] = useImmerReducer(reducer, {
    review: '',
    rating: 0,
    images: [],
  });

  const reviewFetcher = useFetcher();
  const [loaded, setLoaded] = useState(false);

  const handleChangeRating = (num: number) =>
    dispatch(updateRating(num));
  const handleChangeReview = (elm: ChangeEvent<HTMLTextAreaElement>) =>
    dispatch(updateReview(elm.target.value))
  const handleOnChangeImage = (
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

    console.log('debug 1', reviewProduct.uuid)
    console.log('debug 2', orderUUID)

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
                <p className="font-poppins text-base">
                  Add a review
                </p>

                {/* product rating */}
                <ModalBody className="pl-0 pr-0">
                  <div className="flex flex-col mt-2 gap-3">
                    {/* Product Info Row */}
                    <div className="
                      flex flex-row border border-gray-200
                      rounded-lg p-2
                    ">
                      {/* product thumbnail */}
                      <div>
                        <Image
                          alt={`review_${reviewProduct.title}`}
                          src={reviewProduct.url}
                          blurDataURL={`${DOMAIN}/images/${loaded
                            ? 'placeholder_transparent.png'
                            : 'placeholder.svg'
                            }`}
                          onLoadingComplete={() => setLoaded(true)}
                          className="rounded-sm aspect-square"
                          placeholderAspectRatio={1}
                          options={{
                            contentType: MimeType.WEBP,
                            fit: 'contain',
                          }}
                          loaderUrl='/remix-image'
                          responsive={[
                            {
                              size: {
                                width: 75,
                                height: 75,
                              },
                            }
                          ]}
                        />
                      </div>

                      <div className="flex items-center justify-center ml-2">
                        <p className="font-poppins font-medium text-base ">
                          {reviewProduct.title}
                        </p>
                      </div>
                    </div>

                    {/* Product rating row */}
                    <div className="flex flex-col items-start justify-start gap-3">
                      <p className="font-poppins font-medium text-base" >
                        Quality:
                      </p>
                      <div className="">
                        <Rating
                          className=" max-w-[150px]"
                          value={state.rating}
                          itemStyles={{
                            itemShapes: RoundedStar,
                            activeFillColor: '#ffb700',
                            inactiveFillColor: '#fbf1a9'
                          }}
                          onChange={handleChangeRating}
                        />
                        <input
                          type="hidden"
                          name="rating"
                          value={state.rating}
                        />
                      </div>
                    </div>

                    {/* Product review textarea */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="review"
                        className="font-poppins text-base font-medium"
                      >
                        Please share your experience:
                      </label>

                      {/* Review data validation info */}
                      <span className="flex flex-row items-center gap-1">
                        <BiInfoCircle
                          fontSize={16}
                          color='#0A6EBD'
                        />
                        <span className="font-poppins font-normal text-sm text-battleship-grey mt-1 mb-1">
                          Please limit your text to 150 characters and upload 2 images at max.
                        </span>
                      </span>

                      <Textarea
                        className="h-[150px] font-normal"
                        id="review"
                        resize='none'
                        placeholder="Share your experience here"
                        onChange={handleChangeReview}
                      />

                      <input
                        type="hidden"
                        name="review"
                        value={state.review}
                      />
                    </div>

                    {/* image upload area */}
                    <div className="flex flex-col">
                      <ImageUploading
                        multiple
                        value={state.images}
                        onChange={handleOnChangeImage}
                        maxNumber={MaxImageNumber}
                      >
                        {({
                          imageList,
                          onImageUpload,
                          onImageRemoveAll,
                          onImageUpdate,
                          onImageRemove,
                          isDragging,
                          dragProps,
                        }) => {
                          return (
                            <>
                              <div>
                                {/* click or drop area */}
                                <button
                                  className="w-full p-3 bg-[#f6f6f6]"
                                  onClick={onImageUpload}
                                >
                                  <div className={`
                                border-dashed border-2 ${isDragging ? 'border-black' : 'border-[#bbb]'} rounded-sm
                                p-2 text-center
                                capitalize flex justify-center items-center gap-3
                              `}
                                    {...dragProps}
                                  >
                                    <span>
                                      <BsFillPlusCircleFill fontSize={26} color='#54B435' />
                                    </span>
                                    <p className="font-poppins font-normal">
                                      click or drop image here
                                    </p>
                                  </div>
                                </button>
                              </div>

                              {/* images */}
                              <div className="flex flex-row mt-4 gap-4 p-2">
                                {
                                  state.images.map((image, idx) => (
                                    <div
                                      className="relative"
                                      key={idx}
                                    >
                                      <IconButton
                                        className="absolute rounded-[50%] left-[-13px] top-[-8px]"
                                        aria-label={`remove-review-img-${idx}`}
                                        icon={<RxCross1 />}
                                        fontSize='14px'
                                        size={'xs'}
                                        onClick={() => onImageRemove(idx)}
                                      />
                                      <img
                                        alt={`review-${idx}`}
                                        width={85}
                                        height={85}
                                        src={image.dataURL}
                                      />
                                    </div>
                                  ))
                                }
                              </div>
                            </>
                          )
                        }}
                      </ImageUploading>
                    </div>

                    {/* action buttons */}
                    <div className="flex flex-row justify-end items-center gap-3">
                      <Button onClick={onClose}>
                        cancel
                      </Button>

                      <Button
                        colorScheme='green'
                        onClick={handleSubmit}
                      >
                        submit
                      </Button>
                    </div>
                  </div>
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
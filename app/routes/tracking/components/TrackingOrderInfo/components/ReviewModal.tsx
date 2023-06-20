import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Textarea,
  IconButton,
} from '@chakra-ui/react';
import Image, { MimeType } from 'remix-image';
import { Rating, RoundedStar } from '@smastrom/react-rating';
import styles from '@smastrom/react-rating/style.css';
import type { LinksFunction } from '@remix-run/node';
import ImageUploading from 'react-images-uploading';
import type { ImageListType } from 'react-images-uploading';
import { RxCross1 } from 'react-icons/rx';

import { DOMAIN } from '~/utils/get_env_source';

import { MaxImageNumber } from '../constants';
import type { TrackOrderProduct } from '../../../types';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

interface ReviewModalParams {
  isOpen: boolean;
  onClose: () => void;
  reviewProduct: TrackOrderProduct | null;
}

/**
 * Product review modal. This modal should contain:
 *
 * - [ ] Ratable stars. 5 stars
 * - [ ] Textarea for inputting comments. max 150 words
 * - [ ] image upload. max 1 image
 * - close, submit button
 */
function ReviewModal({
  isOpen,
  onClose,
  reviewProduct,
}: ReviewModalParams) {
  const [loaded, setLoaded] = useState(false);
  const [value, setValue] = useState(0);
  const [images, setImages] = useState<ImageListType>([]);

  const handleChangeRating = (num: number) => setValue(num);
  const handleOnChangeImage = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined,
  ) => {
    setImages(imageList);
  }

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
                    <div className="flex flex-col items-start justify-start mt-4 gap-3">
                      <p className="font-poppins font-medium text-base" >
                        Quality:
                      </p>

                      <div className="">
                        <Rating
                          className=" max-w-[150px]"
                          value={value}
                          itemStyles={{
                            itemShapes: RoundedStar,
                            activeFillColor: '#ffb700',
                            inactiveFillColor: '#fbf1a9'
                          }}
                          onChange={handleChangeRating}
                        />
                        <input type="hidden" name="rating" value={value} />
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
                      <Textarea
                        className="h-[150px] font-normal"
                        id="review"
                        resize='none'
                        placeholder="share your experience here"
                      />
                    </div>

                    {/* image upload area */}
                    <div className="flex flex-col">
                      <ImageUploading
                        multiple
                        value={images}
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
                                p-2 text-center font-poppins font-normal
                                capitalize
                              `}
                                    {...dragProps}
                                  >
                                    click or drop image here
                                  </div>
                                </button>
                              </div>

                              {/* images */}
                              <div className="flex flex-row mt-4 gap-4 p-2">
                                {
                                  images.map((image, idx) => (
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
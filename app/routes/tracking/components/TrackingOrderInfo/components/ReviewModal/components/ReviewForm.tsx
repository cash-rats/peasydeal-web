import { useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';
import { AlertCircle } from 'lucide-react';
import { OptimizedImage as Image } from '~/components/OptimizedImage';
import { Rating, StickerStar } from '@smastrom/react-rating';
import { BiInfoCircle } from 'react-icons/bi';
import ImageUploading from 'react-images-uploading';
import type { ImageListType } from 'react-images-uploading';
import { BsFillPlusCircleFill } from 'react-icons/bs';
import { RxCross1 } from 'react-icons/rx';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Spinner } from '~/components/ui/spinner';

import { envs } from '~/utils/env';

import type { FormError } from '~/routes/api.product.review/type';
import { maskName } from '~/utils/mask';
import type { TrackOrderProduct } from '../../../../../types';

const MaxImageNumber = 2;

interface ReviewFormParams {
  error: string | null;
  formError: FormError | null;
  name: string;
  rating: number;
  reviewProduct: TrackOrderProduct;
  images: ImageListType;
  isLoading?: boolean;

  onClose: () => void;
  onChangeName: (elm: ChangeEvent<HTMLInputElement>) => void;
  onChangeRating: (rating: number) => void;
  onChangeReview: (elm: ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeImage: (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => void;

  onSubmit: (evt: MouseEvent<HTMLButtonElement>) => void;
}

function ReviewForm({
  error,
  reviewProduct,
  rating,
  formError,
  images,
  isLoading = false,
  name,

  onClose,
  onChangeRating,
  onChangeReview,
  onChangeImage,
  onChangeName,
  onSubmit,
}: ReviewFormParams) {
  const [loaded, setLoaded] = useState(false);
  const [maskedName, setMaskedName] = useState('');
  const handleChangeName = (evt: ChangeEvent<HTMLInputElement>) => {
    setMaskedName(maskName(evt.target.value));
    onChangeName(evt);
  };

  return (
    <div className="flex flex-col mt-2 gap-3">
      {
        error && (
          <Alert variant='destructive' className='items-start gap-2'>
            <AlertCircle className='h-4 w-4 mt-[2px]' />
            <AlertDescription className='font-normal text-base font-poppins'>
              {error}
            </AlertDescription>
          </Alert>
        )
      }

      {/* Product Info Row */}
      <div className="flex flex-row border border-gray-200 rounded-lg p-2">
        {/* product thumbnail */}
        <div>
          <Image
            alt={`review_${reviewProduct.title}`}
            src={reviewProduct.url}
            blurDataURL={`${envs.DOMAIN}/images/${loaded
              ? 'placeholder_transparent.png'
              : 'placeholder.svg'
              }`}
            onLoadingComplete={() => setLoaded(true)}
            className="rounded-sm aspect-square"
            placeholderAspectRatio={1}
            options={{
              contentType: 'image/webp',
              fit: 'contain',
            }}
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

      <div className="flex flex-col items-start justify-start">
        <p className=" font-poppins font-medium text-base">
          You name:
        </p>

        <span className="flex flex-row items-center gap-1">
          <BiInfoCircle
            fontSize={16}
            color='#0A6EBD'
          />

          <span className="font-poppins font-normal text-sm text-battleship-grey mt-1 mb-1">
            We will not display your full name.
          </span>
        </span>

        <div className="h-7">
          {
            name
              ? (
                <span className="font-poppins font-normal text-sm">
                  Masked name: &nbsp;
                  <strong>
                    {maskedName}
                  </strong>
                </span>
              )
              : null
          }
        </div>

        <Input
          placeholder='What is your name?'
          name="name"
          value={name}
          onChange={handleChangeName}
          className='h-10'
        />

        {
          formError?.name && (
            <p className="text-error-msg-red font-normal font-poppins text-sm">
              {formError.name}
            </p>
          )
        }
      </div>

      {/* Product rating row */}
      <div className="flex flex-col items-start justify-start gap-3">
        <p className="font-poppins font-medium text-base" >
          Rate this product:
        </p>
        <div>
          <Rating
            style={{ maxWidth: 150 }}
            value={rating}
            itemStyles={{
              itemShapes: StickerStar,
              activeFillColor: '#ffb700',
              inactiveFillColor: '#fbf1a9'
            }}
            onChange={onChangeRating}
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
            Please limit your text to 100 characters and upload 2 images at max.
          </span>
        </span>

        <textarea
          className="h-[150px] font-normal w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          id="review"
          placeholder="Share your experience here"
          onChange={onChangeReview}
        />

        {
          formError?.review && (
            <div>
              <p className="text-error-msg-red font-normal font-poppins text-sm">
                {formError.review}
              </p>
            </div>
          )
        }
      </div>

      {/* image upload area */}

      <ImageUploading
        multiple
        value={images}
        onChange={onChangeImage}
        maxNumber={MaxImageNumber}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemove,
          isDragging,
          dragProps,
        }) => {
          return (
            <>
              <div className="flex flex-col">
                {/* click or drop area */}
                <button
                  type="button"
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
                  imageList.map((image, idx) => (
                    <div
                      className="relative"
                      key={idx}
                    >
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="absolute right-[-13px] top-[-8px] h-5 w-5 rounded-full p-0"
                        aria-label={`remove-review-img-${idx}`}
                        onClick={() => onImageRemove(idx)}
                      >
                        <RxCross1 className="h-3 w-3" />
                      </Button>
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

      {/* action buttons */}
      <div className="flex flex-row justify-end items-center gap-3">
        <Button type="button" variant="outline" onClick={onClose} className="capitalize">
          cancel
        </Button>

        <Button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="capitalize bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-70"
        >
          {
            isLoading
              ? (
                <span className="flex items-center gap-2">
                  <Spinner className="text-white" />
                  Submitting...
                </span>
              )
              : 'submit'
          }
        </Button>
      </div>
    </div>
  );
}

export default ReviewForm;

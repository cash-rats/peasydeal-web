import { useRef, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { LinksFunction } from 'react-router';
import RightTiltBox, { links as RightTiltBoxLinks } from '~/components/Tags/RightTiltBox';
import Select from 'react-select';
import { TbTruckDelivery, TbTruckReturn } from 'react-icons/tb';
import { Tag, TagLeftIcon } from '@chakra-ui/react';
import { BsLightningCharge, BsChevronRight } from 'react-icons/bs';
import { RiRefund2Fill } from 'react-icons/ri';


import extra10 from '~/images/extra10.png';
import { round10 } from '~/utils/preciseRound';
import { SUPER_DEAL_OFF } from '~/shared/constants';
import ClientOnly from '~/components/ClientOnly';
import QuantityPicker, { links as QuantityPickerLinks } from '~/components/QuantityPicker';
import type { ShoppingCartItem } from '~/sessions/types';

import ProductRating from '~/components/ProductRating';
import PriceRow from './components/PriceRow';
import Reviews from './components/Reviews';
import ReturnPolicyModal from './components/ReturnPolicyModal';
import useStickyActionBar from '../../hooks/useStickyActionBar';
import useSticky from '../../hooks/useSticky';
// @TODO: this component should be placed in nest component.
import ProductDetailSection, { links as ProductDetailSectionLinks } from '../ProductDetailSection';
import ProductActionBar from '../../components/ProductActionBar';
import SocialShare, { links as SocialShareLinks } from '../../components/SocialShare';
import type {
  ProductImg,
  ProductVariation,
  ProductDetail,
} from '../../types';

export const links: LinksFunction = () => {
  return [
    ...ProductDetailSectionLinks(),
    ...RightTiltBoxLinks(),
    ...QuantityPickerLinks(),
    ...SocialShareLinks(),
  ];
};

interface ProductDetailContainerParams {
  sharedImages: ProductImg[];
  variationImages: ProductImg[];
  productDetail: ProductDetail;
  variation: ProductVariation | undefined;
  variationErr: string;
  quantity: number;
  sessionStorableCartItem: ShoppingCartItem;
  isAddingToCart?: boolean;
  tags?: string[];

  onChangeVariation?: (v: any) => void;
  onChangeQuantity?: (evt: ChangeEvent<HTMLInputElement>) => void;
  onIncreaseQuantity?: () => void;
  onDecreaseQuantity?: () => void;
  addToCart?: () => void;
};

function ProductDetailContainer({
  sharedImages,
  variationImages,
  variation,
  variationErr,
  productDetail,
  quantity,
  sessionStorableCartItem,
  isAddingToCart = false,
  tags = [],

  onChangeVariation,
  onChangeQuantity,
  onIncreaseQuantity,
  onDecreaseQuantity,
  addToCart,
}: ProductDetailContainerParams) {
  const [openOpenReturnPolicy, setOpenReturnPolicy] = useState(false);
  const productTopRef = useRef<HTMLDivElement>(null);
  const productContentWrapperRef = useRef<HTMLDivElement>(null);
  const mobileUserActionBarRef = useRef<HTMLDivElement>(null);

  useSticky(productContentWrapperRef, productTopRef, 'sticky', 145);
  useStickyActionBar(mobileUserActionBarRef, productContentWrapperRef);

  const handleOpenModal = () => setOpenReturnPolicy(true);
  const handleCloseModal = () => setOpenReturnPolicy(false);

  const hasSuperDeal = useMemo(function () {
    let _hasSuperDeal = false;

    tags.forEach((name: string) => {
      if (name === 'super_deal') {
        _hasSuperDeal = true;
      }
    });

    return _hasSuperDeal;
  }, [tags]);

  const PriceRowMemo = useMemo(() => {
    if (!variation?.sale_price) return null;
    if (!variation?.retail_price) return (
      <PriceRow
        salePrice={variation.sale_price}
        previousRetailPrice={[]}
      />
    );

    const salePrice = variation?.sale_price;
    const retailPrice = variation?.retail_price;

    return hasSuperDeal
      ? (
        <PriceRow
          salePrice={round10(salePrice * SUPER_DEAL_OFF, -2)}
          previousRetailPrice={[salePrice, retailPrice]}
        />
      )
      : (
        <PriceRow
          salePrice={salePrice}
          previousRetailPrice={[retailPrice]}
        />
      )
  }, [variation, hasSuperDeal]);

  return (
    <div className="
        flex justify-start flex-col gap-2
        lg:grid grid-cols-10
      "
      ref={productTopRef}
    >
      <ReturnPolicyModal
        isOpen={openOpenReturnPolicy}
        onClose={handleCloseModal}
      />
      {/* Desktop Display - product detail exhibit */}
      <div className='col-span-5 xl:col-span-6'>
        <ProductDetailSection
          sharedPics={sharedImages}
          variationPics={variationImages}
          selectedVariationUUID={variation?.uuid}
          title={productDetail.title}
          description={productDetail.description}
        />

        {/* Reviews */}
        {/* <Reviews productUUID={productDetail.uuid} /> */}
      </div>

      {/* product content */}
      <div
        ref={productContentWrapperRef}
        className="
								rounded-md border-x border-b border-t-8 border-[#D02E7D]
								py-7 px-5
								w-full
								h-fit
								sticky
								col-span-5 xl:col-span-4
                mt-6
							"
      >

        {
          hasSuperDeal && (
            <img
              alt='extra 10% off - super deal'
              className='
											absolute
											right-[-20px] md:right-[-36px]
											top-[-45px] md:top-[-43px]
											scale-[0.85]
										'
              src={extra10}
            />
          )
        }

        <div className="absolute top-[-1.5rem] left-[-1px]">
          <RightTiltBox text={`${productDetail.order_count} bought`} />
        </div>

        <div>

          {
            hasSuperDeal && (
              <Tag
                colorScheme="cyan"
                variant='solid'
                className="nowrap mb-2"
                size='md'
              >
                <TagLeftIcon boxSize='16px' as={BsLightningCharge} />
                <span>SUPER DEAL</span>
              </Tag>
            )
          }

          <h1 className="text-xl md:text-2xl font-bold font-poppings mb-3">
            {productDetail?.title}
          </h1>

          {
            productDetail.num_of_raters > 0
              ? (
                <div className="flex items-center mb-3 gap-2">
                  <ProductRating
                    className="text-lg"
                    value={productDetail?.rating || 0}
                  />

                  <span className="text-sm">
                    {productDetail?.rating} ({productDetail.num_of_raters})
                  </span>
                </div>
              )
              : null
          }

          <div className="flex items-center mb-4">
            {PriceRowMemo}
          </div>

          <div className="flex justify-start items-center mb-4">
            <p
              className='
											flex items-center
											px-2 py-1 md:px-3
											text-[10px] md:text-[12px]
											rounded-[2px] md:rounded-[4px]
											text-white font-medium uppercase
											bg-[#D43B33]
										'
            >
              <b>
                {
                  variation?.discount && (
                    `${(Number(variation.discount) * 100).toFixed(0)} % off`
                  )
                }
              </b>
            </p>
          </div>

          <small className="uppercase">
            <span className=""> availability: </span>
            <span className="text-[#D02E7D]" > in-stock </span>
          </small>

          <hr className='my-4' />
          <div className="mt-5">
            <ClientOnly>
              {
                productDetail?.variations.length > 1
                  ? (
                    <>
                      <Select
                        inputId='variation_id'
                        instanceId='variation_id'
                        placeholder='select variation'
                        value={{
                          value: variation?.uuid,
                          label: variation?.spec_name,
                        }}
                        onChange={onChangeVariation}
                        options={
                          productDetail.variations.map(
                            (variation) => ({ value: variation.uuid, label: variation.spec_name })
                          )
                        }
                      />

                      {variationErr && <p className="error">{variationErr}</p>}
                    </>
                  )
                  : null
              }
            </ClientOnly>

            {/* Quantity */}
            <div className="flex flex-col justify-start items-center w-full mt-3">
              <QuantityPicker
                value={quantity}
                onChange={onChangeQuantity}
                onIncrease={onIncreaseQuantity}
                onDecrease={onDecreaseQuantity}
              />

              <span className="w-full mt-2 text-[#757575] font-sm">
                Max {variation?.purchase_limit} pieces of this item on every purchase.
              </span>
            </div>

            <div className='hidden md:block'>
              <ProductActionBar
                onClickAddToCart={addToCart}
                sessionStorableCartItem={sessionStorableCartItem}
                loading={isAddingToCart}
              />
            </div>
          </div>

          <hr className='my-4' />

          <div className='flex flex-col'>
            <span className='flex my-2'>
              <TbTruckDelivery color="#54B435" fontSize={24} className="mr-2" />
              <span className='font-poppins'>
                {
                  variation
                    ? <>Shipping starting from <b>£{`${variation?.shipping_fee}`}</b></>
                    : null
                }
              </span>
            </span>

            <span className='flex my-2'>
              <RiRefund2Fill color="#54B435" fontSize={24} className="mr-2" />
              <span className='font-poppins'>
                <b>100% money back</b> guarantee
              </span>
            </span>

            <span className='flex my-2 items-center'>
              <TbTruckReturn color="#54B435" fontSize={24} className="mr-2" />
              <span className="box-border hover:border-b-[1px]
                border-b-black text-center text-base
                font-poppins h-[22px] cursor-pointer mr-[2px] leading-[1.3rem]"
                onClick={handleOpenModal}
              >
                Free returns
              </span>
              <BsChevronRight size={10} />
            </span>
          </div>

          <div className="h-[100px] md:hidden">
            <ProductActionBar
              ref={mobileUserActionBarRef}
              onClickAddToCart={addToCart}
              sessionStorableCartItem={sessionStorableCartItem}
              loading={isAddingToCart}
            />
          </div>

          <SocialShare prodUUID={productDetail.uuid} />
        </div>
      </div>
    </div>
  )
};

export default ProductDetailContainer;

import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { Link } from '@remix-run/react';
import { BsBagCheck } from 'react-icons/bs';
import Skeleton from '@mui/material/Skeleton';
import { Input, Button } from '@chakra-ui/react'
import {
  TagLabel,
  Tag,
} from '@chakra-ui/react';
import { ImPriceTags } from 'react-icons/im';
import ResultRow from './components/ResultRow';
import type { PriceInfo } from '../../cart.server';
import { round10 } from '~/utils/preciseRound';


type PriceResultProps = {
  priceInfo: PriceInfo;
  calculating?: boolean;

  // External component tells `PriceResult` previous  applied promo code,
  // regardless of success / failure so that component can render proper text.
  appliedPromoCode?: string;

  onChangePromoCode?: (code: string) => void;
  onApplyPromoCode?: (code: string) => void;
};

interface IPromoCodeBox {
  promoCode: string;
  handleChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  handleApplyPromoCode: () => void;
  calculating: boolean;
  error: string;
  appliedPromoCode: string;
  discountCodeValid: boolean;
}
const PromoCodeBox = ({
  promoCode,
  handleChange,
  handleApplyPromoCode,
  calculating,
  error,
  appliedPromoCode,
  discountCodeValid,
}: IPromoCodeBox) => {
  return (
    <>
      <h2 className='text-lg font-medium mb-2'>
        <span className="capitalize font-semibold">
          promo code
        </span> &nbsp;
        <span className="font-semibold">
          (optional)
        </span>
      </h2>

      {/* promo input */}
      <div className="w-full flex flex-col">
        <Input
          placeholder='Promo code'
          size='lg'
          value={promoCode}
          onChange={handleChange}
          onKeyDown={(evt) => {
            if (evt.key === 'Enter' && promoCode.length > 2) {
              handleApplyPromoCode();
            }
          }}
        />

        {/* invalid promo code message */}
        {
          error && (
            <div className="mt-[10px] h-10">
              <p className="text-[#b21111] font-normal text-base">
                {error}
              </p>
            </div>
          )
        }

        <div className="mt-4 ml-auto">
          <Button
            colorScheme='twitter'
            variant='outline'
            onClick={handleApplyPromoCode}
            isLoading={calculating}
            loadingText='Checking...'
          >
            Apply promo code
          </Button>
        </div>

        {
          discountCodeValid && (
            <div className="mt-[10px] h-10">
              <p className="text-[#00af32] font-normal text-base">
                The promo code <span className="font-semibold">{appliedPromoCode}</span> was successfully applied.
              </p>
            </div>
          )
        }
      </div>
    </>
  );
}

/*
  - [x] Apply promo code button loading state.
*/
export default function PriceResult({
  priceInfo,
  calculating = false,
  appliedPromoCode = '',
  onChangePromoCode = () => { },
  onApplyPromoCode = () => { },
}: PriceResultProps) {
  const [promoCode, setPromoCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (
      appliedPromoCode &&
      !discount_code_valid
    ) {
      setError(`Seems like promo code ${appliedPromoCode} is invalid. Let's check and try again`)
      return;
    }

    setError('');
  }, [
    appliedPromoCode,
    priceInfo,
  ]);

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value || '';
    const code = value.toUpperCase() || '';
    setPromoCode(code);
    onChangePromoCode(code);
  }

  const handleApplyPromoCode = () => {
    window.rudderanalytics?.track('click_apply_promo_code', {
      code: promoCode,
    });
    if (!promoCode) {
      setError('You have not enter any promo code');

      return;
    }

    setError('');
    onApplyPromoCode(promoCode);
  };

  // destructuring priceInfo
  const {
    shipping_fee = 0,
    total_amount = 0,
    discount_amount = 0,
    discount_type = '',
    discount_code_valid = false,
    applied_events = [],
    origin_shipping_fee = 0,
    promo_code_discount = 0,
  } = priceInfo || {};

  const taxIncl = round10(total_amount + promo_code_discount, -2);

  return (
    <div className="p-4 bg-white">
      {/* right */}
      <div className="w-full">
        <PromoCodeBox
          promoCode={promoCode}
          handleChange={handleChange}
          handleApplyPromoCode={handleApplyPromoCode}
          calculating={calculating}
          error={error}
          appliedPromoCode={appliedPromoCode}
          discountCodeValid={!!(
            !error && appliedPromoCode && discount_code_valid
          )}
        />

        <h2 className="
            text-xl font-bold
            pt-6 px-0 w-full mb-4
          "
        >
          Summary
        </h2>

        <div className="py-3">
          <hr className="my-1 h-[1px] w-full bg-slate-50" />
        </div>
        <ResultRow
          label="Items (VAT Incl.)"
          value={
            calculating
              ? (
                <Skeleton
                  variant='text'
                  width={40}
                  sx={{ fontSize: '1rem' }}
                />
              )
              : `£ ${taxIncl}`
          }

        />

        {/* Promo code deal */}
        {
          discount_code_valid
            ? (
              <ResultRow
                label="Promo code deal"
                value={
                  calculating
                    ? (
                      <Skeleton
                        variant='text'
                        width={40}
                        sx={{ fontSize: '1rem' }}
                      />
                    ) : (
                      <div className="result-value text-primary uppercase">
                        <>
                          {
                            discount_type === 'price_off' && (
                              `extra - £ ${discount_amount} off!`
                            )
                          }

                          {
                            discount_type === 'free_shipping' && (
                              'free shipping!'
                            )
                          }

                          {
                            discount_type === 'percentage_off' && (
                              `- £ ${promo_code_discount}`
                            )
                          }
                        </>
                      </div>
                    )
                }
              />
            )
            : null
        }

        <ResultRow
          label='Shipping Cost'
          value={
            calculating
              ? (
                <Skeleton
                  variant='text'
                  width={40}
                  sx={{ fontSize: '1rem' }}
                />
              )
              : (
                <>
                  <span className=''>£ {origin_shipping_fee}</span>
                </>
              )
          }
        />

        {
          shipping_fee === 0
            ? (
              <ResultRow
                label='Shipping Discount'
                value={
                  calculating
                    ? (
                      <Skeleton
                        variant='text'
                        width={40}
                        sx={{ fontSize: '1rem' }}
                      />
                    )
                    : (
                      <>
                        <span className='text-[#D02E7D]'>- £ {origin_shipping_fee}</span>
                      </>
                    )
                }
              />
            )
            : null
        }

        <div className="py-3">
          <hr className="my-1 h-[1px] w-full bg-slate-50" />
        </div>

        {/* Promotion Applied  */}
        <div className="flex flex-col mb-4">
          <h4 className="
            text-base font-bold
            px-0 mb-2 w-full capitalize
          "
          >
            discount applied!
          </h4>
          <div className='flex gap-2'>
            {
              applied_events.length === 0
                ? null
                : (
                  applied_events.map((event, idx) => (
                    <Tag
                      key={`promotion-${idx}`}
                      variant='outline'
                      colorScheme='blue'
                      className='w-fit mb-2'
                      size="md">
                      <ImPriceTags className='mr-1' />
                      <TagLabel>{event}</TagLabel>
                    </Tag>
                  ))
                )
            }
          </div>
        </div>

        <div className="py-3">
          <hr className="my-1 h-[1px] w-full bg-slate-50" />
        </div>

        <div className="mt-[0.7rem]">

          <ResultRow
            label={<strong>Total to pay</strong>}
            value={
              <strong>
                {
                  calculating
                    ? (
                      <Skeleton
                        variant='text'
                        width={100}
                        sx={{ fontSize: '1.5rem' }}
                      />
                    )
                    : `£ ${total_amount}`
                }
              </strong>
            }
          />
        </div>

        <div className="mt-[30px] flex flex-col justify-center">
          <Link to="/checkout" >
            <Button
              size='md'
              height='48px'
              width='100%'
              border='2px'
              colorScheme='yellow'
              borderColor='yellow.500'
              leftIcon={<BsBagCheck fontSize={22} />}
              className="font-bold font-poppins mb-2"
              onClick={() => {
                window.rudderanalytics?.track('click_continue_checkout');
              }}
            >
              Continue to checkout
            </Button>
          </Link>

          <Link to="/">
            <Button
              colorScheme='teal'
              variant='ghost'
              className='w-full'
              onClick={() => {
                window.rudderanalytics?.track('click_continue_shopping');
              }}
            >
              Continue shopping
            </Button>
          </Link>
        </div>
      </div>
    </div >
  );
};
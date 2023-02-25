import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { Link } from '@remix-run/react';
import { BsBagCheck } from 'react-icons/bs';
import Skeleton from '@mui/material/Skeleton';
import { Input, Button } from '@chakra-ui/react'

import ResultRow from './components/ResultRow';
import type { PriceInfo } from '../../cart.server';

const TAX = 0.2;

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
        />

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
      !priceInfo.discount_code_valid
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
    const v = evt.target.value;
    setPromoCode(v);
    onChangePromoCode(v);
  }

  const handleApplyPromoCode = () => {
    if (!promoCode) {
      setError('You have not enter any promo code');

      return;
    }

    setError('');
    onApplyPromoCode(promoCode);
  };

  return (
    <div className="p-4 md:p-6 bg-white">
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
            !error && appliedPromoCode && priceInfo.discount_code_valid
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
          label="Items"
          value={
            calculating
              ? (
                <Skeleton
                  variant='text'
                  width={40}
                  sx={{ fontSize: '1rem' }}
                />
              )
              : `£ ${priceInfo.sub_total} `
          }

        />

        <ResultRow
          label={`Tax (${TAX * 100}%)`}
          value={
            calculating
              ? (
                <Skeleton
                  variant='text'
                  width={40}
                  sx={{ fontSize: '1rem' }}
                />
              )
              : `£ ${priceInfo.tax_amount}`
          }

        />

        {/* Promo code deal */}
        {
          priceInfo.discount_code_valid
            ? (
              <ResultRow
                label="Promo code deal"
                value={

                  <div className="result-value text-primary uppercase">
                    {
                      priceInfo.discount_type === 'price_off' && (
                        `extra - £ ${priceInfo.discount_amount} off!`
                      )
                    }

                    {
                      priceInfo.discount_type === 'free_shipping' && (
                        'free shipping!'
                      )
                    }

                    {
                      priceInfo.discount_type === 'percentage_off' && (
                        `extra - £ ${priceInfo.discount_amount}`
                      )
                    }
                  </div>

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
                  {
                    priceInfo.discount_type === 'free_shipping'
                      ? '£ 0'
                      : `£ ${priceInfo.shipping_fee}`
                  }
                </>
              )
          }
        />

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
                    : `£ ${priceInfo.total_amount}`
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
            >
              Continue to checkout
            </Button>
          </Link>

          <Link to="/">
            <Button colorScheme='teal' variant='ghost' className='w-full'>
              Continue shopping
            </Button>
          </Link>
        </div>
      </div>
    </div >
  );
};
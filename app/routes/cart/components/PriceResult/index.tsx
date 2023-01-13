import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { Link } from '@remix-run/react';
import { BsBagCheck } from 'react-icons/bs';
import Skeleton from '@mui/material/Skeleton';
import ClipLoader from "react-spinners/ClipLoader";

import { TAX } from '~/utils/checkout_accountant';
import RoundButton from '~/components/RoundButton';

import ResultRow from './components/ResultRow';
import type { PriceInfo } from '../../cart.server';

type PriceResultProps = {
  priceInfo: PriceInfo;
  calculating?: boolean;

  // External component tells `PriceResult` previous  applied promo code,
  // regardless of success / failure so that component can render proper text.
  appliedPromoCode?: string;

  onChangePromoCode?: (code: string) => void;
  onApplyPromoCode?: (code: string) => void;
};

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
    <div className="m-5 flex">

      {/* left */}
      <div className="w-0 576:w-[60%]" />

      {/* right */}
      <div className="w-full 576:w-[40%] flex flex-col gap-[7px]">
        <div className="flex flex-col gap-2">
          <h2>
            <span className="capitalize font-semibold">
              promo code
            </span> &nbsp;
            <span className="font-semibold">
              (optional)
            </span>
          </h2>

          {/* promo input */}
          <div className="w-full flex flex-col">
            <input
              type="text"
              className='text-left appearance-none bg-white
              border-t-0 border-b-0 border-l-[1px] border-r-[1px]
              border-solid border-[#d9d9d9] rounded-[3px]
              box-border text-base h-8 m-0 py-2 px-4 align-middle
              w-full focus:bg-[rgba(0, 102, 255, .5)] shadow-dropdown
              flex-1
            '
              placeholder='Promo code'
              name='promote_code'
              value={promoCode}
              onChange={handleChange}
            />

            <div className="mt-4">
              <button
                className='flex-1 mt-[10x] mx-0 mb-0
                bg-[#6750b7] shadow-button
                text-base h-[50px] w-full text-white
                inline-flex items-center justify-center
                border-none py-2 px-[35px]
                relative whitespace-nowrap box-border
                cursor-pointer rounded-[4px]
                transition-all duration-200
                hover:shadow-button-hover
              '
                onClick={handleApplyPromoCode}
                disabled={calculating}
              >
                <span className="
                  flex justify-center items-center
                  relative w-full
                "
                >
                  <span className="capitalize font-medium">
                    apply promo code
                  </span>
                  {
                    calculating && (
                      <span className="absolute right-0 top-0">
                        <ClipLoader size={24} color="#fff" />
                      </span>
                    )
                  }
                </span>
              </button>
            </div>

            {/* invalid promo code message */}
            <div className="mt-[10px] h-10">
              <p className="text-[#b21111] font-normal text-base">
                {error}
              </p>

              {
                !error &&
                appliedPromoCode &&
                priceInfo.discount_code_valid && (
                  <p className="text-[#00af32] font-normal text-base">
                    The promo code <span className="font-semibold">{appliedPromoCode}</span> was successfully applied.
                  </p>
                )
              }
            </div>
          </div>
        </div>

        <h2 className="
            text-xl font-bold
            pt-6 px-0 w-full pb-4 mb-4
            border-b-[1px] border-b-solid border-[#ccc]
          "
        >
          Summary
        </h2>
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

        <div className="mt-[0.7rem]">
          <ResultRow
            label={<strong>Total</strong>}
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

        <div className="mt-[30px] flex justify-end">
          <Link to="/checkout" >
            <RoundButton
              size='large'
              colorScheme='checkout'
              leftIcon={<BsBagCheck fontSize={22} />}
            >
              <b>Proceed Checkout</b>
            </RoundButton>
          </Link>
        </div>
      </div>
    </div >
  );
};
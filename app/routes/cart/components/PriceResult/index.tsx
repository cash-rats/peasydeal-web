import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link } from '@remix-run/react';
import { BsBagCheck } from 'react-icons/bs';
import Skeleton from '@mui/material/Skeleton';
import ClipLoader from "react-spinners/ClipLoader";

import { TAX } from '~/utils/checkout_accountant';
import RoundButton from '~/components/RoundButton';

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
  - [ ] Apply promo code button loading state.
*/
export default function PriceResult({
  priceInfo,
  calculating = false,
  appliedPromoCode = '',
  onChangePromoCode = () => { },
  onApplyPromoCode = () => { },
}: PriceResultProps) {
  console.log('debug priceInfo', priceInfo);
  const [promoCode, setPromoCode] = useState('');
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const v = evt.target.value;
    setPromoCode(v);
    onChangePromoCode(v);
  }

  const handleApplyPromoCode = () => onApplyPromoCode(promoCode);

  return (
    <div className="result-row">
      <div className="left" />

      <div className="right">
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
          <div className="flex flex-col max-w-[300px]">
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
            <div className="mt-[10px]">
              {
                appliedPromoCode &&
                !priceInfo.discount_code_valid && (
                  <p className="text-[#b21111] font- text-base">
                    Seems like promo code {appliedPromoCode} is invalid. Let's check and try again
                  </p>
                )
              }

              {
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

        <h2 className="Cart__result-row-summary">
          Summary
        </h2>
        <div className="subtotal">
          <label> Items </label>
          <div className="result-value">
            {
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
          </div>

        </div>

        <div className="tax">
          <label> Tax ({TAX * 100}%) </label>
          <div className="result-value">
            {
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
          </div>
        </div>

        {/* Promo code deal */}
        {
          priceInfo.discount_code_valid
            ? (
              <div>
                <label> Promo code deal </label>
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
              </div>
            )
            : null
        }

        <div>
          <label> Shipping Cost </label>
          <div className="result-value">
            {
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
          </div>
        </div>


        <div className="grand-total">
          <label> <strong>Total</strong> </label>
          <div className="result-value">
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
          </div>
        </div>

        <div className="checkout-button">
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
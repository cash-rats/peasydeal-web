import {
  type ChangeEvent,
  useEffect,
  useState,
} from 'react';
import { Link } from 'react-router';
import { BsBagCheck } from 'react-icons/bs';
import { ImPriceTags } from 'react-icons/im';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { cn } from '~/lib/utils';
import ResultRow from './components/ResultRow';
import { round10 } from '~/utils/preciseRound';

import type { PriceInfo } from '../../types';

type PriceResultProps = {
  priceInfo: PriceInfo;
  calculating?: boolean;
  appliedPromoCode?: string;
  onChangePromoCode?: (code: string) => void;
  onApplyPromoCode?: (code: string) => void;
};

interface PromoCodeBoxProps {
  promoCode: string;
  handleChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  handleApplyPromoCode: () => void;
  calculating: boolean;
  error: string;
  appliedPromoCode: string;
  discountCodeValid: boolean;
  discountErrorMsgs: string[];
}

const InlineSkeleton = ({
  width = 80,
  height = 20,
  className,
}: {
  width?: number | string;
  height?: number | string;
  className?: string;
}) => (
  <span
    aria-hidden
    className={cn(
      'inline-flex animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-700',
      className
    )}
    style={{ width, height }}
  />
);

const PromoCodeBox = ({
  promoCode,
  handleChange,
  handleApplyPromoCode,
  calculating,
  error,
  appliedPromoCode,
  discountCodeValid,
  discountErrorMsgs,
}: PromoCodeBoxProps) => {
  return (
    <>
      <h2 className="text-lg font-medium mb-2">
        <span className="capitalize font-semibold">promo code</span> &nbsp;
        <span className="font-semibold">(optional)</span>
      </h2>

      <div className="w-full flex flex-col gap-2">
        <Input
          placeholder="Promo code"
          value={promoCode}
          className="h-12 text-base font-medium uppercase tracking-wide md:text-lg"
          onChange={handleChange}
          onKeyDown={(evt) => {
            if (evt.key === 'Enter' && promoCode.length > 2) {
              handleApplyPromoCode();
            }
          }}
        />

        {error && (
          <div className="mt-1 text-error-msg-red font-normal text-base">
            {error}
          </div>
        )}

        <div className="mt-3 flex justify-end">
          <Button
            variant="outline"
            className="px-5 text-sm font-semibold tracking-wide"
            size="lg"
            disabled={calculating}
            onClick={handleApplyPromoCode}
          >
            {calculating ? 'Checking...' : 'Apply promo code'}
          </Button>
        </div>

        {discountCodeValid && discountErrorMsgs.length === 0 && (
          <div className="mt-2 text-[#00af32] font-normal text-base">
            The promo code{' '}
            <span className="font-semibold">{appliedPromoCode}</span> was
            successfully applied.
          </div>
        )}

        {discountErrorMsgs.length > 0 &&
          discountErrorMsgs.map((msg, idx) => (
            <div
              className="mt-2 text-[#D02E7D] font-normal text-base"
              key={`error-code-msg-${idx}`}
            >
              {msg}
            </div>
          ))}
      </div>
    </>
  );
};

export default function PriceResult({
  priceInfo,
  calculating = false,
  appliedPromoCode = '',
  onChangePromoCode = () => { },
  onApplyPromoCode = () => { },
}: PriceResultProps) {
  const [promoCode, setPromoCode] = useState('');
  const [error, setError] = useState('');

  const {
    shipping_fee = 0,
    sub_total = 0,
    tax_amount = 0,
    total_amount = 0,
    discount_amount = 0,
    discount_type = '',
    discount_code_valid = false,
    applied_events = [],
    origin_shipping_fee = 0,
    promo_code_discount = 0,
    discount_error_msgs: discountErrorMsgs = [],
  } = priceInfo || {};

  useEffect(() => {
    if (appliedPromoCode && !discount_code_valid) {
      setError(
        `Seems like promo code ${appliedPromoCode} is invalid. Let's check and try again`
      );
      return;
    }

    setError('');
  }, [appliedPromoCode, discount_code_valid, priceInfo]);

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value || '';
    const code = value.toUpperCase();
    setPromoCode(code);
    onChangePromoCode(code);
  };

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

  const taxIncl = round10(sub_total + tax_amount + promo_code_discount, -2);

  return (
    <div className="p-4 bg-white">
      <div className="w-full">
        <PromoCodeBox
          promoCode={promoCode}
          handleChange={handleChange}
          handleApplyPromoCode={handleApplyPromoCode}
          calculating={calculating}
          error={error}
          appliedPromoCode={appliedPromoCode}
          discountErrorMsgs={discountErrorMsgs}
          discountCodeValid={!!(!error && appliedPromoCode && discount_code_valid)}
        />

        <h2 className="text-xl font-bold pt-6 mb-4">Summary</h2>

        <div className="py-3">
          <hr className="my-1 h-[1px] w-full bg-slate-50" />
        </div>

        <ResultRow
          label="Items (VAT Incl.)"
          value={
            calculating ? (
              <InlineSkeleton width={45} height={20} />
            ) : (
              `£ ${taxIncl}`
            )
          }
        />

        {discount_code_valid && (
          <ResultRow
            label="Promo code deal"
            value={
              calculating ? (
                <InlineSkeleton width={45} height={20} />
              ) : (
                <div className="result-value text-primary uppercase">
                  {discount_type === 'price_off' && `extra - £ ${discount_amount} off!`}
                  {discount_type === 'free_shipping' && 'free shipping!'}
                  {discount_type === 'percentage_off' && `- £ ${promo_code_discount}`}
                </div>
              )
            }
          />
        )}

        <ResultRow
          label="Shipping Cost"
          value={
            calculating ? (
              <InlineSkeleton width={45} height={20} />
            ) : (
              `£ ${origin_shipping_fee}`
            )
          }
        />

        <div className="py-3">
          <hr className="my-1 h-[1px] w-full bg-slate-50" />
        </div>

        {applied_events.length > 0 && (
          <>
            <div className="flex flex-col mb-4">
              <h4 className="text-base font-bold mb-2 capitalize font-poppins">
                discount applied!
              </h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {applied_events.map((event, idx) => (
                  <span
                    key={`promotion-${idx}`}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                  >
                    <ImPriceTags className="text-base" />
                    {event}
                  </span>
                ))}
              </div>

              {shipping_fee === 0 && (
                <ResultRow
                  label="Shipping Discount"
                  value={
                    calculating ? (
                      <InlineSkeleton width={45} height={20} />
                    ) : (
                      <span className="text-[#D02E7D]">- £ {origin_shipping_fee}</span>
                    )
                  }
                />
              )}

              {promo_code_discount !== 0 && (
                <ResultRow
                  label="Promo Discount"
                  value={
                    calculating ? (
                      <InlineSkeleton width={45} height={20} />
                    ) : (
                      <span className="text-[#D02E7D]">- £ {promo_code_discount}</span>
                    )
                  }
                />
              )}
            </div>

            <div className="py-3">
              <hr className="my-1 h-[1px] w-full bg-slate-50" />
            </div>
          </>
        )}

        <div className="mt-[0.7rem]">
          <ResultRow
            label={<strong>Total to pay</strong>}
            value={
              <strong>
                {calculating ? (
                  <InlineSkeleton width={100} height={30} />
                ) : (
                  `£ ${total_amount}`
                )}
              </strong>
            }
          />
        </div>

        <div className="mt-[30px] flex flex-col justify-center gap-3">
          <Link to="/checkout">
            <Button
              className="w-full border-2 border-yellow-500 bg-yellow-500 text-black font-bold shadow-none"
              size="lg"
              onClick={() => {
                window.rudderanalytics?.track('click_continue_checkout');
              }}
            >
              <BsBagCheck fontSize={22} />
              Continue to checkout
            </Button>
          </Link>

          <Link to="/">
            <Button
              variant="ghost"
              className="w-full font-medium"
              onClick={() => {
                window.rudderanalytics?.track('click_continue_shopping');
              }}
            >
              Continue shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

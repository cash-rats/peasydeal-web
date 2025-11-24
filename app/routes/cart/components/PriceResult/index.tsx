import {
  type ChangeEvent,
  type MouseEvent,
  useEffect,
  useState,
} from 'react';
import { Link } from 'react-router';
import { BsBagCheck, BsCheckCircleFill, BsExclamationCircleFill } from 'react-icons/bs';
import { ImPriceTags } from 'react-icons/im';
import { HiOutlineTicket } from 'react-icons/hi';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { cn } from '~/lib/utils';
import { round10 } from '~/utils/preciseRound';

import ResultRow from './components/ResultRow';
import type { PriceInfo } from '../../types';

type PriceResultProps = {
  priceInfo: PriceInfo | null;
  calculating?: boolean;
  appliedPromoCode?: string;
  onChangePromoCode?: (code: string) => void;
  onApplyPromoCode?: (code: string) => void;
  onCheckout?: () => void;
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

const defaultPriceInfo: PriceInfo = {
  sub_total: 0,
  tax_amount: 0,
  shipping_fee: 0,
  origin_shipping_fee: 0,
  discount_amount: 0,
  shipping_fee_discount: 0,
  promo_code_discount: 0,
  discount_reason: '',
  total_amount: 0,
  currency: '',
  vat_included: false,
  discount_code_valid: false,
  products: [],
  percentage_off_amount: 0,
  discount_error_msgs: [],
  discount_type: 'price_off',
  applied_events: [],
};

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

const LoadingSpinner = ({ className }: { className?: string }) => (
  <span
    aria-hidden
    className={cn(
      'inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent',
      className
    )}
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
      <div className="flex items-center gap-2 mb-3">
        <HiOutlineTicket className="text-[#D02E7D] text-xl" />
        <h2 className="text-lg font-semibold text-slate-800">
          Promo Code <span className="text-slate-500 font-normal">(optional)</span>
        </h2>
      </div>

      <div className="w-full flex flex-col gap-2">
        <Input
          placeholder="Enter your promo code"
          value={promoCode}
          className="h-12 text-base font-medium uppercase tracking-wide md:text-lg border-slate-300 focus:border-[#D02E7D] focus:ring-[#D02E7D]/20"
          disabled={calculating}
          onChange={handleChange}
          onKeyDown={(evt) => {
            if (evt.key === 'Enter' && promoCode.length > 2) {
              handleApplyPromoCode();
            }
          }}
        />

        {error && (
          <div className="mt-1 flex items-center gap-2 text-error-msg-red font-normal text-base">
            <BsExclamationCircleFill className="text-sm flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="mt-3 flex justify-end">
          <Button
            variant="outline"
            className="px-5 text-sm font-semibold tracking-wide border-[#D02E7D] text-[#D02E7D] hover:bg-[#D02E7D]/10"
            size="lg"
            disabled={calculating}
            onClick={handleApplyPromoCode}
          >
            {calculating ? (
              <>
                <LoadingSpinner className="text-[#D02E7D]" />
                Checking...
              </>
            ) : (
              'Apply promo code'
            )}
          </Button>
        </div>

        {discountCodeValid && discountErrorMsgs.length === 0 && (
          <div className="mt-2 flex items-center gap-2 text-[#00af32] font-normal text-base bg-green-50 px-3 py-2 rounded-md">
            <BsCheckCircleFill className="text-sm flex-shrink-0" />
            <span>
              Promo code <span className="font-semibold">{appliedPromoCode}</span> applied successfully!
            </span>
          </div>
        )}

        {discountErrorMsgs.length > 0 &&
          discountErrorMsgs.map((msg, idx) => (
            <div
              className="mt-2 flex items-center gap-2 text-[#D02E7D] font-normal text-base bg-pink-50 px-3 py-2 rounded-md"
              key={`error-code-msg-${idx}`}
            >
              <BsExclamationCircleFill className="text-sm flex-shrink-0" />
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
  onCheckout = () => { },
}: PriceResultProps) {
  const [promoCode, setPromoCode] = useState('');
  const [error, setError] = useState('');

  const {
    shipping_fee = 0,
    sub_total = 0,
    tax_amount = 0,
    total_amount = 0,
    discount_amount = 0,
    discount_type = 'price_off',
    discount_code_valid = false,
    applied_events = [],
    origin_shipping_fee = 0,
    promo_code_discount = 0,
    discount_error_msgs: discountErrorMsgs = [],
  } = priceInfo ?? defaultPriceInfo;

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
  const handleCheckoutClick = () => {
    if (calculating) {
      return;
    }

    window.rudderanalytics?.track('click_continue_checkout');
    onCheckout?.();
  };

  const handleContinueShoppingClick = (evt: MouseEvent<HTMLAnchorElement>) => {
    if (calculating) {
      evt.preventDefault();
      evt.stopPropagation();
      return;
    }

    window.rudderanalytics?.track('click_continue_shopping');
  };

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

        <div className="pt-6 mb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Summary
          </h2>
          <div className="mt-2 h-[2px] w-12 bg-[#D02E7D] rounded-full" />
        </div>

        <div className="py-2">
          <hr className="h-[1px] w-full bg-slate-200" />
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

        <div className="py-2">
          <hr className="h-[1px] w-full bg-slate-200" />
        </div>

        {applied_events.length > 0 && (
          <>
            <div className="flex flex-col mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#D02E7D]/10">
                  <ImPriceTags className="text-sm text-[#D02E7D]" />
                </div>
                <h4 className="text-base font-bold text-slate-800 font-poppins">
                  Discount Applied!
                </h4>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {applied_events.map((event, idx) => (
                  <span
                    key={`promotion-${idx}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#D02E7D]/30 bg-[#D02E7D]/5 px-3 py-1.5 text-sm font-semibold text-[#D02E7D]"
                  >
                    <ImPriceTags className="text-xs" />
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

            <div className="py-2">
              <hr className="h-[1px] w-full bg-slate-200" />
            </div>
          </>
        )}

        <div className="mt-3 bg-slate-50 rounded-lg p-4 border border-slate-100">
          <ResultRow
            label={<span className="text-lg font-bold text-slate-800">Total to pay</span>}
            value={
              <span className="text-xl font-bold text-[#D02E7D]">
                {calculating ? (
                  <InlineSkeleton width={100} height={30} />
                ) : (
                  `£ ${total_amount}`
                )}
              </span>
            }
          />
        </div>

        <div className="mt-[30px] flex flex-col justify-center gap-3">
          <Button
            className="w-full font-bold text-lg shadow-sm bg-amber-400 text-slate-900 border border-amber-300 hover:bg-amber-300 hover:border-amber-200"
            size="lg"
            disabled={calculating}
            onClick={handleCheckoutClick}
          >
            {calculating ? (
              <>
                <LoadingSpinner className="text-slate-900" />
                Calculating...
              </>
            ) : (
              <>
                <BsBagCheck fontSize={22} />
                Continue to checkout
              </>
            )}
          </Button>

          <Link
            to="/"
            aria-disabled={calculating}
            tabIndex={calculating ? -1 : undefined}
            onClick={handleContinueShoppingClick}
          >
            <Button
              className="w-full text-lg font-semibold border-[#D02E7D] text-white bg-[#D02E7D] hover:bg-[#B8256A] hover:border-[#B8256A] transition-colors"
              size="lg"
              disabled={calculating}
            >
              {calculating ? 'Calculating...' : 'Continue shopping'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

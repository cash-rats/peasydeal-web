import {
  type ChangeEvent,
  type MouseEvent,
  useState,
} from 'react';
import { Link } from 'react-router';
import { BsBagCheck, BsCheckCircleFill, BsExclamationCircleFill } from 'react-icons/bs';
import { ImPriceTags } from 'react-icons/im';
import { HiLightningBolt, HiOutlineTicket, HiSparkles, HiTruck } from 'react-icons/hi';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { cn } from '~/lib/utils';
import { round10 } from '~/utils/preciseRound';
import { trackEvent } from '~/lib/gtm';

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

const getDiscountBadgeTheme = (eventName: string) => {
  const normalized = (eventName || '').toLowerCase();

  if (normalized.includes('super deal')) {
    return {
      className:
        'bg-blue-50 text-blue-600 border-blue-100',
      Icon: HiLightningBolt,
    };
  }

  if (normalized.includes('free shipping')) {
    return {
      className:
        'bg-emerald-50 text-emerald-600 border-emerald-100',
      Icon: HiTruck,
    };
  }

  if (normalized.includes('new sub')) {
    return {
      className:
        'bg-amber-50 text-amber-600 border-amber-100',
      Icon: HiSparkles,
    };
  }

  return {
    className:
      'bg-slate-50 text-slate-600 border-slate-100',
    Icon: ImPriceTags,
  };
};

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

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value || '';
    const code = value.toUpperCase();
    setPromoCode(code);
    setError('');
    onChangePromoCode(code);
  };

  const handleApplyPromoCode = () => {
    trackEvent('pd_click_apply_promo_code', {
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

    trackEvent('pd_click_continue_checkout');
    onCheckout?.();
  };

  const handleContinueShoppingClick = (evt: MouseEvent<HTMLAnchorElement>) => {
    if (calculating) {
      evt.preventDefault();
      evt.stopPropagation();
      return;
    }

    trackEvent('pd_click_continue_shopping');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
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
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Summary</h2>

        <div className="space-y-4 text-sm">
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

          {applied_events.length > 0 && (
            <>
              <div className="py-2 border-t border-dashed border-slate-200" />
              <div className="flex flex-wrap gap-2">
                {applied_events.map((event, idx) => {
                  const { className, Icon } = getDiscountBadgeTheme(event);

                  return (
                    <span
                      key={`promotion-${idx}`}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wide border',
                        className
                      )}
                    >
                      <Icon className="h-3 w-3" aria-hidden />
                      {event}
                    </span>
                  );
                })}
              </div>

              {shipping_fee === 0 && (
                <ResultRow
                  label="Shipping Discount"
                  value={
                    calculating ? (
                      <InlineSkeleton width={45} height={20} />
                    ) : (
                      <span className="text-[#D02E7D] font-bold">- £ {origin_shipping_fee}</span>
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
                      <span className="text-[#D02E7D] font-bold">- £ {promo_code_discount}</span>
                    )
                  }
                />
              )}
            </>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200">
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

        <div className="mt-6 flex flex-col justify-center gap-3">
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

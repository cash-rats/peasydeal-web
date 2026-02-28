import { useState } from "react";
import { cn } from "~/lib/utils";

export interface OrderItem {
  id: string;
  name: string;
  variant?: string;
  thumbnailSrc?: string;
  quantity: number;
  salePrice?: number;
  retailPrice: number;
}

export interface OrderSummaryProps {
  items: OrderItem[];
  subtotal: number;
  shipping?: number | null;
  shippingCost?: number | null;
  shippingDiscount?: number;
  shippingLabel?: string;
  tax?: number;
  taxIncluded?: boolean;
  discount?: number;
  discountCode?: string;
  total: number;
  onApplyDiscount?: (code: string) => void;
  onRemoveDiscount?: () => void;
  discountError?: string;
  currency?: string;
  className?: string;
}

/* ─── Icons ─── */
function DiscountIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M1 7.59L6.41 2H12V7.59L6.59 13L1 7.59Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.5" cy="4.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function RemoveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 4L10 10M10 4L4 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function OrderSummary({
  items,
  subtotal,
  shipping,
  shippingCost,
  shippingDiscount,
  shippingLabel = "Calculated at next step",
  tax,
  taxIncluded,
  discount,
  discountCode,
  total,
  onApplyDiscount,
  onRemoveDiscount,
  discountError,
  currency = "$",
  className,
}: OrderSummaryProps) {
  const [code, setCode] = useState("");
  const canApplyDiscount = Boolean(onApplyDiscount);

  const handleApply = () => {
    if (code.trim() && onApplyDiscount) {
      onApplyDiscount(code.trim());
    }
  };

  return (
    <div className={className}>
      {/* Order items */}
      <div className="flex flex-col gap-4 pb-5 border-b border-[#E0E0E0]">
        {items.map((item) => {
          const price = (item.salePrice ?? item.retailPrice) * item.quantity;
          const c = currency;

          return (
            <div key={item.id} className="flex items-center gap-4">
              {/* Thumbnail with quantity badge */}
              <div className="relative w-16 h-16 flex-shrink-0">
                <div className="w-full h-full rounded-lg border border-[#E0E0E0] overflow-hidden bg-white">
                  {item.thumbnailSrc && (
                    <img
                      src={item.thumbnailSrc}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 rounded-full bg-black/70 text-white font-body text-[11px] font-semibold flex items-center justify-center px-[5px]">
                  {item.quantity}
                </span>
              </div>

              {/* Item info */}
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium text-black truncate">
                  {item.name}
                </p>
                {item.variant && (
                  <p className="font-body text-xs text-[#888] mt-0.5">
                    {item.variant}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="flex-shrink-0 text-right">
                {item.salePrice != null ? (
                  <>
                    <span className="font-body text-sm font-medium text-[#C75050]">
                      {c}{(item.salePrice * item.quantity).toFixed(2)}
                    </span>
                    <span className="block font-body text-xs text-[#999] line-through">
                      {c}{(item.retailPrice * item.quantity).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="font-body text-sm font-medium text-black">
                    {c}{price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {(canApplyDiscount || discountCode) ? (
        <div className="py-5 border-b border-[#E0E0E0]">
          {canApplyDiscount ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Discount code or gift card"
                className={cn(
                  "flex-1 h-11 px-3.5 border rounded-md font-body text-sm text-black bg-white outline-none transition-all duration-fast",
                  discountError
                    ? "border-[#C75050] shadow-[0_0_0_1px_#C75050]"
                    : "border-[#CCC] focus:border-black focus:shadow-[0_0_0_1px_#000]"
                )}
              />
              <button
                type="button"
                onClick={handleApply}
                className={cn(
                  "h-11 px-5 rounded-md border-none font-body text-sm font-medium transition-colors duration-fast",
                  code.trim()
                    ? "bg-black text-white cursor-pointer hover:bg-[#333]"
                    : "bg-[#E0E0E0] text-[#888] cursor-default"
                )}
                disabled={!code.trim()}
              >
                Apply
              </button>
            </div>
          ) : null}
          {discountError && canApplyDiscount && (
            <p className="font-body text-xs text-[#C75050] mt-1.5">
              {discountError}
            </p>
          )}
          {discountCode && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F0F0F0] rounded-md mt-2.5">
              <span className="text-[#888]"><DiscountIcon /></span>
              <span className="font-body text-[13px] font-medium text-black">
                {discountCode}
              </span>
              {onRemoveDiscount ? (
                <button
                  type="button"
                  onClick={onRemoveDiscount}
                  className="text-[#888] hover:text-black bg-transparent border-none p-0 cursor-pointer transition-colors duration-fast"
                >
                  <RemoveIcon />
                </button>
              ) : null}
            </div>
          )}
        </div>
      ) : null}

      {/* Price breakdown */}
      <div className="pt-5 flex flex-col gap-2.5">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="font-body text-sm text-[#666]">Subtotal</span>
          <span className="font-body text-sm text-black">
            {currency}{subtotal.toFixed(2)}
          </span>
        </div>

        {/* Discount */}
        {discount != null && discount > 0 && (
          <div className="flex justify-between items-center">
            <span className="font-body text-sm text-[#666]">Discount</span>
            <span className="font-body text-sm text-[#4A7C59]">
              -{currency}{discount.toFixed(2)}
            </span>
          </div>
        )}

        {/* Shipping cost */}
        <div className="flex justify-between items-center">
          <span className="font-body text-sm text-[#666]">Shipping Cost</span>
          <span className="font-body text-sm text-[#888]">
            {shippingCost != null
              ? `${currency}${shippingCost.toFixed(2)}`
              : shipping != null
                ? `${currency}${shipping.toFixed(2)}`
              : shippingLabel}
          </span>
        </div>

        {/* Shipping discount */}
        {shippingDiscount != null && shippingDiscount > 0 && (
          <div className="flex justify-between items-center">
            <span className="font-body text-sm text-[#666]">Shipping Discount</span>
            <span className="font-body text-sm text-[#D02E7D]">
              -{currency}{shippingDiscount.toFixed(2)}
            </span>
          </div>
        )}

        {/* Tax */}
        {tax != null && (
          <div className="flex justify-between items-center">
            <span className="font-body text-sm text-[#666]">Tax</span>
            <span className="font-body text-sm text-black">
              {currency}{tax.toFixed(2)}
            </span>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-baseline pt-4 border-t border-[#E0E0E0] mt-1.5">
          <span className="font-body text-base text-black">Total</span>
          <span className="font-body text-2xl font-bold text-black">
            <span className="text-xs font-normal text-[#888] mr-1.5 align-middle">
              {currency === "$" ? "USD" : ""}
            </span>
            {currency}{total.toFixed(2)}
          </span>
        </div>

        {/* Tax included note */}
        {taxIncluded && tax != null && (
          <p className="font-body text-xs text-[#888] text-right mt-0.5">
            Including {currency}{tax.toFixed(2)} in taxes
          </p>
        )}
      </div>
    </div>
  );
}

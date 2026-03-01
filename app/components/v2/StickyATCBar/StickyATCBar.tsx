import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "~/lib/utils";
import { QuantityPicker } from "~/components/v2/QuantityPicker";

export interface StickyATCBarProps {
  /** Ref to the price block element to observe visibility */
  priceBlockRef: React.RefObject<HTMLDivElement>;
  productName: string;
  thumbnailSrc?: string;
  salePrice?: number;
  /** Original sale price before super_deal discount */
  originalSalePrice?: number;
  retailPrice: number;
  currency?: string;
  variants?: Array<{ label: string; value: string }>;
  selectedVariant?: string;
  onVariantChange?: (value: string) => void;
  quantity?: number;
  maxQuantity?: number;
  onQuantityChange?: (qty: number) => void;
  onAddToCart?: () => void;
  className?: string;
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 9L7.5 13.5L15 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StickyATCBar({
  priceBlockRef,
  productName,
  thumbnailSrc,
  salePrice,
  originalSalePrice,
  retailPrice,
  currency = "$",
  variants,
  selectedVariant,
  onVariantChange,
  quantity = 1,
  maxQuantity = 99,
  onQuantityChange,
  onAddToCart,
  className,
}: StickyATCBarProps) {
  const [visible, setVisible] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Observe price block visibility
  useEffect(() => {
    const el = priceBlockRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [priceBlockRef]);

  const handleAddToCart = useCallback(() => {
    onAddToCart?.();
    setConfirmed(true);
    if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
    confirmTimerRef.current = setTimeout(() => setConfirmed(false), 1200);
  }, [onAddToCart]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
    };
  }, []);

  const getDisplayVariantLabel = useCallback(
    (label: string) => (label.toLowerCase() === "default title" ? "Default" : label),
    []
  );

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[999] bg-white border-t border-[#E0E0E0]",
        "transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        visible ? "translate-y-0" : "translate-y-full",
        className
      )}
    >
      <div className="max-w-[var(--container-max)] mx-auto px-4 redesign-sm:px-6 redesign-md:px-12 h-14 redesign-md:h-16 flex items-center gap-4 redesign-md:gap-6">
        {/* Product info (hidden on mobile) */}
        <div className="hidden redesign-sm:flex items-center gap-4 flex-1 min-w-0">
          {thumbnailSrc && (
            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-[#F5F5F5]">
              <img
                src={thumbnailSrc}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-body text-sm font-medium text-black truncate">
              {productName}
            </p>
            <div className="flex items-baseline gap-1.5 mt-px">
              {salePrice != null ? (
                <>
                  <span className="font-body text-sm font-semibold text-[#C75050]">
                    {currency}{salePrice.toFixed(2)}
                  </span>
                  {originalSalePrice != null && originalSalePrice !== salePrice && (
                    <span className="font-body text-xs font-normal text-[#999] line-through">
                      {currency}{originalSalePrice.toFixed(2)}
                    </span>
                  )}
                  <span className="font-body text-xs font-normal text-[#999] line-through">
                    {currency}{retailPrice.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="font-body text-sm font-semibold text-black">
                  {currency}{retailPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile: price only */}
        <div className="flex redesign-sm:hidden items-baseline gap-1.5 flex-shrink-0">
          {salePrice != null ? (
            <>
              <span className="font-body text-sm font-semibold text-[#C75050]">
                {currency}{salePrice.toFixed(2)}
              </span>
              {originalSalePrice != null && originalSalePrice !== salePrice && (
                <span className="font-body text-xs font-normal text-[#999] line-through">
                  {currency}{originalSalePrice.toFixed(2)}
                </span>
              )}
              <span className="font-body text-xs font-normal text-[#999] line-through">
                {currency}{retailPrice.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="font-body text-sm font-semibold text-black">
              {currency}{retailPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Variant select (hidden on mobile/tablet) */}
          {variants && variants.length > 1 && (
            <div className="hidden redesign-md:block relative">
              <select
                value={selectedVariant ?? ""}
                onChange={(e) => onVariantChange?.(e.target.value)}
                className="
                  h-10 pl-3.5 pr-8 border border-[#E0E0E0] rounded-full
                  font-body text-[13px] font-medium text-black bg-white appearance-none cursor-pointer
                  transition-colors duration-fast
                  hover:border-black
                  hover:bg-[#F5F5F5]
                  focus-visible:outline-none focus-visible:border-black focus-visible:ring-1 focus-visible:ring-black
                "
              >
                {variants.map((v) => (
                  <option key={v.value} value={v.value}>
                    {getDisplayVariantLabel(v.label)}
                  </option>
                ))}
              </select>
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#888]"
              >
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}

          {/* Quantity picker */}
          <QuantityPicker
            value={quantity}
            max={maxQuantity}
            onChange={(v) => onQuantityChange?.(v)}
            size="pill"
          />

          {/* Add to Cart */}
          <button
            type="button"
            className={cn(
              "h-10 px-7 rounded-full font-body text-[13px] font-semibold border-none cursor-pointer whitespace-nowrap transition-colors duration-fast",
              "redesign-sm:flex-none flex-1",
              confirmed
                ? "bg-[#4A7C59] text-white"
                : "bg-black text-white hover:bg-[#333] active:bg-[#1A1A1A]"
            )}
            onClick={handleAddToCart}
          >
            {confirmed ? <CheckIcon /> : "Add To Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

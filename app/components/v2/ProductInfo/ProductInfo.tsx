import { useState, useCallback, useEffect, useRef, forwardRef } from "react";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/v2/Badge";
import { QuantityPicker } from "~/components/v2/QuantityPicker";
import { Button } from "~/components/v2/Button";

export interface ProductVariant {
  label: string;
  value: string;
}

export interface AccordionItem {
  title: string;
  /** Rendered as HTML via dangerouslySetInnerHTML */
  content: string;
}

export interface ProductInfoProps {
  badges?: Array<{
    variant: "discount" | "new" | "selling-fast" | "hot" | "limited" | "super-deal";
    label: string;
  }>;
  title: string;
  productUUID?: string;
  rating?: number;
  reviewCount?: number;
  salePrice?: number;
  /** Original sale price before super_deal discount — shown struck through */
  originalSalePrice?: number;
  retailPrice: number;
  currency?: string;
  shippingNote?: string;
  description?: string;
  stock?: number;
  variants?: ProductVariant[];
  selectedVariant?: string;
  onVariantChange?: (value: string) => void;
  onVariantHoverStart?: (value: string) => void;
  onVariantHoverEnd?: () => void;
  quantity?: number;
  onQuantityChange?: (qty: number) => void;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  accordionItems?: AccordionItem[];
  onShare?: () => void;
  onAskQuestion?: () => void;
  /** Ref forwarded to the price block for StickyATCBar visibility */
  priceRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

type ShareThis = {
  initialize?: () => void;
  href?: string;
};

const loadShareThisScript = (onLoad?: () => void) => {
  if (typeof document === "undefined") return;
  const existingScript = document.getElementById("sharethis");
  if (existingScript) {
    onLoad?.();
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.id = "sharethis";
  if (onLoad) {
    script.onload = onLoad;
  }
  script.src = "https://platform-api.sharethis.com/js/sharethis.js#property=635bb7bc9c9fa7001910fbe2&product=sop";
  script.type = "text/javascript";
  document.body.appendChild(script);
};

function StarIcon({ filled, half }: { filled: boolean; half?: boolean }) {
  if (half) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="halfStar">
            <stop offset="50%" stopColor="#E8A040" />
            <stop offset="50%" stopColor="#E0E0E0" />
          </linearGradient>
        </defs>
        <path d="M8 1L10 5.5H15L11 8.5L12.5 13L8 10L3.5 13L5 8.5L1 5.5H6L8 1Z" fill="url(#halfStar)" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M8 1L10 5.5H15L11 8.5L12.5 13L8 10L3.5 13L5 8.5L1 5.5H6L8 1Z"
        fill={filled ? "#E8A040" : "#E0E0E0"}
      />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M1 3H10V11H1V3ZM10 6H13L15 8V11H10V6ZM4 11C4 12.1 3.1 13 2 13C0.9 13 0 12.1 0 11M13 11C13 12.1 12.1 13 11 13C9.9 13 9 12.1 9 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 4V8L10.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M7 1V9M7 1L4 4M7 1L10 4M2 9V12H12V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckSmallIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M2 6L4.5 8.5L10 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const ProductInfo = forwardRef<HTMLDivElement, ProductInfoProps>(
  function ProductInfo(
    {
      badges,
      title,
      productUUID,
      rating = 0,
      reviewCount = 0,
      salePrice,
      originalSalePrice,
      retailPrice,
      currency = "$",
      shippingNote,
      description,
      stock,
      variants,
      selectedVariant,
      onVariantChange,
      onVariantHoverStart,
      onVariantHoverEnd,
      quantity = 1,
      onQuantityChange,
      onAddToCart,
      onBuyNow,
      accordionItems,
      onShare,
      priceRef,
      className,
    },
    ref
  ) {
    const [descExpanded, setDescExpanded] = useState(false);
    const [openAccordion, setOpenAccordion] = useState<number | null>(null);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const sharePopoverRef = useRef<HTMLDivElement>(null);

    const toggleAccordion = useCallback((index: number) => {
      setOpenAccordion((prev) => (prev === index ? null : index));
    }, []);

    useEffect(() => {
      if (!isShareOpen || typeof window === "undefined") return;

      const initializeShare = () => {
        const st = (window as typeof window & { __sharethis__?: ShareThis }).__sharethis__;
        if (!st?.initialize) return;
        st.href = window.location.href;
        st.initialize();
      };

      const st = (window as typeof window & { __sharethis__?: ShareThis }).__sharethis__;
      if (!st) {
        loadShareThisScript(initializeShare);
      } else {
        initializeShare();
      }
    }, [isShareOpen, productUUID]);

    useEffect(() => {
      if (!isShareOpen) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (!sharePopoverRef.current) return;
        if (!sharePopoverRef.current.contains(event.target as Node)) {
          setIsShareOpen(false);
        }
      };

      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setIsShareOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEsc);
      };
    }, [isShareOpen]);

    const renderStars = () => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
          stars.push(<StarIcon key={i} filled />);
        } else if (rating >= i - 0.5) {
          stars.push(<StarIcon key={i} filled={false} half />);
        } else {
          stars.push(<StarIcon key={i} filled={false} />);
        }
      }
      return stars;
    };

    return (
      <div ref={ref} className={cn("flex flex-col pt-2", className)}>
        {/* Badges */}
        {badges && badges.length > 0 && (
          <div className="flex gap-1.5 mb-3">
            {badges.map((b, i) =>
              b.variant === "super-deal" ? (
                <Badge key={i} variant="super-deal">
                  <span className="inline-flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M6.5 1L3 7H6L5.5 11L9 5H6L6.5 1Z" fill="currentColor" />
                    </svg>
                    {b.label}
                    <span className="relative group/tip cursor-help">
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                        <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1" />
                        <path d="M4.2 4.3C4.2 3.6 4.8 3 5.5 3C6.2 3 6.8 3.6 6.8 4.3C6.8 5 5.5 5.2 5.5 6" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
                        <circle cx="5.5" cy="7.5" r="0.4" fill="currentColor" />
                      </svg>
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-black text-white font-body text-[10px] font-medium rounded whitespace-nowrap opacity-0 pointer-events-none group-hover/tip:opacity-100 transition-opacity duration-fast">
                        Extra 10% OFF
                      </span>
                    </span>
                  </span>
                </Badge>
              ) : (
                <Badge key={i} variant={b.variant}>
                  {b.label}
                </Badge>
              )
            )}
          </div>
        )}

        {/* Title */}
        <h1 className="font-heading text-[32px] font-bold text-black leading-[1.2] mb-3">
          {title}
        </h1>

        {/* Rating */}
        {reviewCount > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">{renderStars()}</div>
            <span className="font-body text-sm font-normal text-[#888]">
              ({reviewCount})
            </span>
          </div>
        )}

        {/* Price block */}
        <div ref={priceRef} className="mb-1">
          <div className="flex items-baseline flex-wrap gap-x-2.5">
            {salePrice != null ? (
              <>
                <span className="font-heading text-2xl font-bold text-[#C75050]">
                  {currency}{salePrice.toFixed(2)}
                </span>
                {originalSalePrice != null && originalSalePrice !== salePrice && (
                  <span className="font-body text-base font-normal text-[#999] line-through">
                    {currency}{originalSalePrice.toFixed(2)}
                  </span>
                )}
                <span className="font-body text-base font-normal text-[#999] line-through">
                  {currency}{retailPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-heading text-2xl font-bold text-black">
                {currency}{retailPrice.toFixed(2)}
              </span>
            )}
          </div>
          {shippingNote && (
            <p className="font-body text-[13px] font-normal text-[#888] mt-1">
              {shippingNote}
            </p>
          )}
        </div>

        {/* Description */}
        {description && (
          <div className="my-4">
            <p
              className={cn(
                "font-body text-sm font-normal text-[#666] leading-[1.6]",
                !descExpanded && "line-clamp-3"
              )}
            >
              {description}
            </p>
            {description.length > 150 && (
              <button
                type="button"
                className="font-body text-sm font-medium text-black underline underline-offset-2 mt-1"
                onClick={() => setDescExpanded(!descExpanded)}
              >
                {descExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}

        {/* Stock indicator */}
        {stock != null && stock > 0 && (
          <div className="flex items-center gap-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#4A7C59]" />
            <span className="font-body text-[13px] font-medium text-[#4A7C59]">
              {stock} in stock
            </span>
          </div>
        )}

        {/* Variant selector */}
        {variants && variants.length > 0 && (
          <div className="mb-5 rounded-2xl border border-[#D1D5DB] p-3.5">
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div>
                <p className="font-body text-sm font-semibold text-black">
                  Choose option
                </p>
              </div>
            </div>

            <p className="font-body text-sm text-[#374151] mb-2.5">
              <span className="font-semibold">Current:</span>{" "}
              <span className="font-medium">
                {(() => {
                  const label = variants.find((v) => v.value === selectedVariant)?.label ?? "";
                  return label.toLowerCase() === "default title" ? "Default" : label;
                })()}
              </span>
            </p>

            <div className="flex flex-wrap gap-2">
              {variants.map((v) => {
                const displayLabel = v.label.toLowerCase() === "default title" ? "Default" : v.label;
                const isSelected = v.value === selectedVariant;
                return (
                  <button
                    key={v.value}
                    type="button"
                    aria-pressed={isSelected}
                    className={cn(
                      "group px-4 py-2.5 min-h-11 rounded-xl font-body text-sm font-semibold border-2 cursor-pointer",
                      "transition-all duration-150 ease-out",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/25 focus-visible:ring-offset-2",
                      isSelected
                        ? "border-black bg-black text-white shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
                        : "border-[#9CA3AF] bg-[#E5E7EB] text-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:-translate-y-px hover:border-[#4B5563] hover:bg-[#F9FAFB] hover:shadow-[0_8px_20px_rgba(17,24,39,0.12)] active:translate-y-0 active:shadow-[0_2px_8px_rgba(17,24,39,0.12)]"
                    )}
                    onClick={() => onVariantChange?.(v.value)}
                    onMouseEnter={() => onVariantHoverStart?.(v.value)}
                    onMouseLeave={() => onVariantHoverEnd?.()}
                    onFocus={() => onVariantHoverStart?.(v.value)}
                    onBlur={() => onVariantHoverEnd?.()}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {isSelected && <CheckSmallIcon />}
                      {displayLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity + Add to Cart */}
        <div className="flex gap-3 mb-3">
          <QuantityPicker
            value={quantity}
            onChange={(v) => onQuantityChange?.(v)}
          />
          <Button
            variant="secondary"
            className="
              flex-1 h-12 border-2 border-[#111827] bg-white text-[#111827]
              shadow-[0_2px_8px_rgba(17,24,39,0.08)]
              hover:-translate-y-px hover:bg-[#F9FAFB] hover:shadow-[0_10px_22px_rgba(17,24,39,0.14)]
              active:translate-y-0 active:scale-[0.99] active:shadow-[0_2px_8px_rgba(17,24,39,0.1)]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/25 focus-visible:ring-offset-2
            "
            onClick={onAddToCart}
          >
            Add to Cart
          </Button>
        </div>

        {/* Buy It Now */}
        <Button
          variant="primary"
          className="w-full h-12 mb-4"
          onClick={onBuyNow}
        >
          Buy It Now
        </Button>
        <div className="mb-5 pb-5 border-b border-[#E0E0E0]">
          <div className="flex items-start gap-1.5">
            <TruckIcon />
            <div>
              <p className="font-body text-sm font-semibold text-black">
                Free shipping
              </p>
              <p className="font-body text-[13px] font-normal text-[#888] mt-0.5">
                FREE Shipping on order £19.99+
              </p>
            </div>
          </div>
        </div>

        {/* Money back guarantee */}
        <div className="mb-5 pb-5 border-b border-[#E0E0E0]">
          <div className="flex items-start gap-1.5">
            <ClockIcon />
            <div>
              <p className="font-body text-sm font-semibold text-black">
                7-day returns
              </p>
              <p className="font-body text-[13px] font-normal text-[#888] mt-0.5">
                100% money back guarantee
              </p>
            </div>
          </div>
        </div>

        {/* Accordion sections */}
        {accordionItems && accordionItems.length > 0 && (
          <div>
            {accordionItems.map((item, i) => {
              const isOpen = openAccordion === i;
              return (
                <div key={i} className="border-b border-[#E0E0E0]">
                  <button
                    type="button"
                    className="flex w-full justify-between items-center py-5 cursor-pointer"
                    onClick={() => toggleAccordion(i)}
                    aria-expanded={isOpen}
                  >
                    <span className="font-body text-base font-semibold text-black">
                      {item.title}
                    </span>
                    <PlusIcon
                      className={cn(
                        "text-black transition-transform duration-fast flex-shrink-0",
                        isOpen && "rotate-45"
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-slow",
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={cn(
                          "pb-5 font-body text-sm font-normal text-[#666] leading-[1.6] break-words",
                          "[&_p]:mb-3 [&_p]:last:mb-0",
                          "[&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-black [&_h2]:mt-4 [&_h2]:mb-2",
                          "[&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-black [&_h3]:mt-3 [&_h3]:mb-1.5",
                          "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3",
                          "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3",
                          "[&_li]:mb-1",
                          "[&_strong]:font-semibold [&_strong]:text-[#444]",
                          "[&_a]:text-black [&_a]:underline",
                          "[&_br]:content-[''] [&_br]:block [&_br]:mt-2",
                          "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-rd-sm [&_img]:my-3"
                        )}
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action links */}
        <div className="flex gap-5 pt-4">
          <div ref={sharePopoverRef} className="relative">
            <button
              type="button"
              className="flex items-center gap-1.5 font-body text-[13px] font-normal text-[#888] hover:text-black transition-colors duration-fast"
              onClick={() => {
                onShare?.();
                setIsShareOpen((prev) => !prev);
              }}
              aria-expanded={isShareOpen}
              aria-haspopup="dialog"
            >
              <ShareIcon />
              Share
            </button>

            {isShareOpen && (
              <div
                className="
                  absolute left-0 bottom-full mb-2 z-20
                  min-w-[240px] rounded-xl border border-[#E5E7EB] bg-white p-3
                  shadow-[0_10px_30px_rgba(17,24,39,0.16)]
                "
              >
                <p className="mb-2 font-body text-xs font-semibold text-black">
                  Share This Product:
                </p>
                <div className="sharethis-inline-share-buttons text-left" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

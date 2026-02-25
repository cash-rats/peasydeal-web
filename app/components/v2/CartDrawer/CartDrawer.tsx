import { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "~/lib/utils";
import { QuantityPicker } from "~/components/v2/QuantityPicker";

export interface CartItem {
  id: string;
  name: string;
  variant?: string;
  thumbnailSrc?: string;
  salePrice?: number;
  /** Original sale price before super_deal discount */
  originalSalePrice?: number;
  retailPrice: number;
  quantity: number;
  currency?: string;
}

export interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onQuantityChange?: (id: string, qty: number) => void;
  onRemoveItem?: (id: string) => void;
  freeShippingThreshold?: number;
  giftWrapPrice?: number;
  giftWrapChecked?: boolean;
  onGiftWrapChange?: (checked: boolean) => void;
  onViewCart?: () => void;
  onCheckout?: () => void;
  currency?: string;
  className?: string;
}

/* ─── Icons ─── */
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function RemoveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function EmptyBagIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M16 16V14C16 9.58 19.58 6 24 6C28.42 6 32 9.58 32 14V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="10" y="16" width="28" height="26" rx="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8.5 2.5L11.5 5.5M1.5 10.5V12.5H3.5L11 5L9 3L1.5 10.5Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M7 1C4.79 1 3 2.79 3 5C3 8 7 13 7 13S11 8 11 5C11 2.79 9.21 1 7 1Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="5" r="1.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M1 7.59L6.41 2H12V7.59L6.59 13L1 7.59Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.5" cy="4.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CartDrawer({
  open,
  onClose,
  items,
  onQuantityChange,
  onRemoveItem,
  freeShippingThreshold = 19.99,
  giftWrapPrice,
  giftWrapChecked = false,
  onGiftWrapChange,
  onViewCart,
  onCheckout,
  currency = "$",
  className,
}: CartDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Handle mount/unmount for animation
  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(true));
      });
    } else {
      setAnimating(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + (i.salePrice ?? i.retailPrice) * i.quantity,
    0
  );

  const shippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100
  );
  const freeShippingReached = shippingRemaining <= 0;

  if (!mounted) return null;

  return (
    <div className={cn("fixed inset-0 z-[9998]", className)}>
      {/* Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity duration-300",
          animating ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={cn(
          "fixed top-0 right-0 bottom-0 w-[420px] max-w-[100vw] bg-white z-[9999] flex flex-col",
          "transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "redesign-sm:w-[420px] w-[100vw]",
          animating ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-6 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-[22px] font-bold text-black">
              Cart
            </h2>
            {itemCount > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-black text-white font-body text-xs font-semibold">
                {itemCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center bg-transparent border-none cursor-pointer text-black hover:text-[#888] transition-colors duration-fast"
            aria-label="Close cart"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Free shipping progress */}
        {items.length > 0 && (
          <div className="px-6 pb-4">
            <p className="font-body text-[13px] text-black mb-2">
              {freeShippingReached ? (
                "You've qualified for free shipping!"
              ) : (
                <>
                  Spend{" "}
                  <span className="font-bold">
                    {currency}
                    {shippingRemaining.toFixed(2)}
                  </span>{" "}
                  more to reach free shipping!
                </>
              )}
            </p>
            <div className="w-full h-1 bg-[#E0E0E0] rounded-sm overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-sm transition-all duration-300",
                  freeShippingReached ? "bg-[#4A7C59]" : "bg-black"
                )}
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart items or empty state */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="text-[#CCC] mb-4">
              <EmptyBagIcon />
            </div>
            <h3 className="font-heading text-xl font-bold text-black mb-2">
              Your cart is empty
            </h3>
            <p className="font-body text-sm text-[#888] mb-6">
              Add items to get started
            </p>
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-8 rounded-full border-[1.5px] border-black bg-white text-black font-body text-sm font-semibold cursor-pointer hover:bg-[#F5F5F5] transition-colors duration-fast"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            {/* Scrollable items */}
            <div className="flex-1 overflow-y-auto px-6 scrollbar-none">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className={cn(
                    "relative flex items-start gap-4 py-4",
                    idx < items.length - 1 && "border-b border-[#F0F0F0]"
                  )}
                >
                  {/* Thumbnail */}
                  {item.thumbnailSrc && (
                    <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#F5F5F5]">
                      <img
                        src={item.thumbnailSrc}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0 pr-5">
                    <p className="font-body text-sm font-medium text-black mb-0.5 leading-snug line-clamp-2">
                      {item.name}
                    </p>
                    {item.variant && (
                      <p className="font-body text-xs text-[#888] mb-1">
                        {item.variant}
                      </p>
                    )}
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      {item.salePrice != null ? (
                        <>
                          <span className="font-body text-sm font-semibold text-[#C75050]">
                            {item.currency ?? currency}
                            {item.salePrice.toFixed(2)}
                          </span>
                          {item.originalSalePrice != null && item.originalSalePrice !== item.salePrice && (
                            <span className="font-body text-xs text-[#999] line-through">
                              {item.currency ?? currency}
                              {item.originalSalePrice.toFixed(2)}
                            </span>
                          )}
                          <span className="font-body text-xs text-[#999] line-through">
                            {item.currency ?? currency}
                            {item.retailPrice.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="font-body text-sm font-semibold text-black">
                          {item.currency ?? currency}
                          {item.retailPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Quantity picker */}
                    <div className="mt-2">
                      <QuantityPicker
                        value={item.quantity}
                        onChange={(v) => onQuantityChange?.(item.id, v)}
                        size="compact"
                      />
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => onRemoveItem?.(item.id)}
                    className="absolute top-4 right-0 w-5 h-5 flex items-center justify-center bg-transparent border-none cursor-pointer text-[#CCC] hover:text-black transition-colors duration-fast"
                    aria-label={`Remove ${item.name}`}
                  >
                    <RemoveIcon />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-6 pt-4 pb-6 border-t border-[#E0E0E0] bg-white">
              {/* Gift wrap */}
              {/* {giftWrapPrice != null && (
                <label className="flex items-center gap-2.5 pb-4 border-b border-[#E0E0E0] mb-3 cursor-pointer">
                  <span
                    className={cn(
                      "w-4 h-4 rounded-[3px] border-[1.5px] flex-shrink-0 flex items-center justify-center transition-colors duration-fast",
                      giftWrapChecked
                        ? "bg-black border-black text-white"
                        : "bg-white border-[#CCC]"
                    )}
                  >
                    {giftWrapChecked && <CheckIcon />}
                  </span>
                  <span className="font-body text-[13px] text-black">
                    For <span className="font-semibold">{currency}{giftWrapPrice.toFixed(2)}</span>, please wrap the products in this order.
                  </span>
                </label>
              )} */}

              {/* Action links */}
              {/* <div className="flex gap-5 mb-4">
                <button type="button" className="flex items-center gap-1.5 font-body text-[13px] text-black bg-transparent border-none p-0 cursor-pointer hover:text-[#666] transition-colors duration-fast">
                  <span className="text-[#888]"><PencilIcon /></span>
                  Order note
                </button>
                <button type="button" className="flex items-center gap-1.5 font-body text-[13px] text-black bg-transparent border-none p-0 cursor-pointer hover:text-[#666] transition-colors duration-fast">
                  <span className="text-[#888]"><LocationIcon /></span>
                  Estimate Shipping
                </button>
                <button type="button" className="flex items-center gap-1.5 font-body text-[13px] text-black bg-transparent border-none p-0 cursor-pointer hover:text-[#666] transition-colors duration-fast">
                  <span className="text-[#888]"><TagIcon /></span>
                  Coupon
                </button>
              </div> */}

              {/* Estimated total */}
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-body text-base font-semibold text-black">
                  Estimated total
                </span>
                <span className="font-body text-lg font-bold text-black">
                  {currency}{subtotal.toFixed(2)}
                  <span className="text-sm font-normal text-[#888] ml-1">
                    {currency === "$" ? "USD" : ""}
                  </span>
                </span>
              </div>

              {/* Tax note */}
              <p className="font-body text-xs text-[#888] mb-4">
                Taxes and{" "}
                <span className="underline text-black">shipping</span>{" "}
                calculated at checkout
              </p>

              {/* CTA buttons */}
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={onViewCart}
                  className="flex-1 h-12 rounded-full border-[1.5px] border-black bg-white text-black font-body text-sm font-semibold cursor-pointer hover:bg-[#F5F5F5] transition-colors duration-fast"
                >
                  View Cart
                </button>
                <button
                  type="button"
                  onClick={onCheckout}
                  className="flex-[1.5] h-12 rounded-full border-none bg-black text-white font-body text-sm font-semibold cursor-pointer hover:bg-[#333] transition-colors duration-fast"
                >
                  Check Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

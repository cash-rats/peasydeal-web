import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { QuantityPicker } from "~/components/v2/QuantityPicker";

export interface CartPageItem {
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

export interface CartPageProps {
  items: CartPageItem[];
  priceInfo?: {
    discount_code_valid?: boolean;
    discount_error_msgs?: string[];
    promo_code_discount?: number;
  } | null;
  appliedPromoCode?: string;
  onApplyPromoCode?: (code: string) => void;
  promoApplying?: boolean;
  promoError?: string;
  onQuantityChange?: (id: string, qty: number) => void;
  onRemoveItem?: (id: string) => void;
  onCheckout?: () => void;
  onContinueShopping?: () => void;
  currency?: string;
  className?: string;
}

/* ─── Icons ─── */
function EmptyBagIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20 20V18C20 12.48 24.48 8 30 8H34C39.52 8 44 12.48 44 18V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="12" y="20" width="40" height="36" rx="4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/* ─── Remove Confirmation Modal ─── */
function RemoveModal({
  itemName,
  onCancel,
  onConfirm,
}: {
  itemName: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 max-w-[400px] w-[90%] shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
        <h3 className="font-body text-lg font-semibold text-black mb-2">
          Remove item?
        </h3>
        <p className="font-body text-sm text-[#666] mb-6 leading-relaxed">
          Are you sure you want to remove &ldquo;{itemName}&rdquo; from your
          cart?
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-12 rounded-lg border-[1.5px] border-[#E0E0E0] bg-white text-black font-body text-sm font-semibold cursor-pointer hover:bg-[#F5F5F5] transition-colors duration-fast"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-12 rounded-lg border-none bg-[#C75050] text-white font-body text-sm font-semibold cursor-pointer hover:bg-[#B04444] transition-colors duration-fast"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export function CartPage({
  items,
  priceInfo = null,
  appliedPromoCode = "",
  onApplyPromoCode,
  promoApplying = false,
  promoError = "",
  onQuantityChange,
  onRemoveItem,
  onCheckout,
  onContinueShopping,
  currency = "$",
  className,
}: CartPageProps) {
  const [removingItem, setRemovingItem] = useState<CartPageItem | null>(null);
  const [promoCodeInput, setPromoCodeInput] = useState(appliedPromoCode);
  const [promoInputError, setPromoInputError] = useState("");

  const subtotal = items.reduce(
    (sum, i) => sum + (i.salePrice ?? i.retailPrice) * i.quantity,
    0
  );
  const discountCodeValid = Boolean(priceInfo?.discount_code_valid && appliedPromoCode);
  const discountErrorMsgs = priceInfo?.discount_error_msgs ?? [];
  const promoCodeDiscount = Number(priceInfo?.promo_code_discount ?? 0);
  const canApplyPromoCode = Boolean(onApplyPromoCode);

  useEffect(() => {
    setPromoCodeInput(appliedPromoCode);
    setPromoInputError("");
  }, [appliedPromoCode]);

  const handleRemoveConfirm = () => {
    if (removingItem) {
      onRemoveItem?.(removingItem.id);
      setRemovingItem(null);
    }
  };

  const handleApplyPromoCode = () => {
    const normalized = promoCodeInput.trim().toUpperCase();
    if (!normalized) {
      setPromoInputError("You have not enter any promo code");
      return;
    }

    setPromoInputError("");
    onApplyPromoCode?.(normalized);
  };

  if (items.length === 0) {
    return (
      <div
        className={cn(
          "max-w-[var(--container-max)] mx-auto py-20 px-12 text-center",
          className
        )}
      >
        <div className="text-[#CCC] mx-auto mb-6">
          <EmptyBagIcon />
        </div>
        <h1 className="font-heading text-[28px] font-bold text-black mb-3">
          Your cart is empty
        </h1>
        <p className="font-body text-sm text-[#666] mb-7">
          Looks like you haven't added anything yet
        </p>
        <button
          type="button"
          onClick={onContinueShopping}
          className="h-12 px-8 rounded-lg border-none bg-black text-white font-body text-[15px] font-semibold cursor-pointer hover:bg-[#333] transition-colors duration-fast"
        >
          Continue shopping
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "max-w-[var(--container-max)] mx-auto py-12 px-4 redesign-sm:px-6 redesign-md:px-12",
        className
      )}
    >
      <h1 className="font-heading text-[32px] font-bold text-black mb-10 text-center">
        Your cart
      </h1>

      {/* Desktop table */}
      <div className="hidden redesign-sm:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E0E0E0]">
              <th className="font-body text-xs font-normal text-[#888] uppercase tracking-wider pb-3 text-left w-1/2">
                Product
              </th>
              <th className="font-body text-xs font-normal text-[#888] uppercase tracking-wider pb-3 text-center">
                Price
              </th>
              <th className="font-body text-xs font-normal text-[#888] uppercase tracking-wider pb-3 text-center">
                Quantity
              </th>
              <th className="font-body text-xs font-normal text-[#888] uppercase tracking-wider pb-3 text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const c = item.currency ?? currency;
              const price = item.salePrice ?? item.retailPrice;
              const total = price * item.quantity;

              return (
                <tr key={item.id} className="border-b border-[#E0E0E0]">
                  {/* Product */}
                  <td className="py-6">
                    <div className="flex items-center gap-5">
                      {item.thumbnailSrc && (
                        <div className="w-[100px] h-[100px] rounded-lg border border-[#E0E0E0] overflow-hidden flex-shrink-0">
                          <img
                            src={item.thumbnailSrc}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-body text-[15px] font-medium text-black mb-1">
                          {item.name}
                        </p>
                        {item.variant && (
                          <p className="font-body text-[13px] text-[#888] mb-2">
                            {item.variant}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => setRemovingItem(item)}
                          className="font-body text-xs text-[#888] underline bg-transparent border-none p-0 cursor-pointer hover:text-[#C75050] transition-colors duration-fast"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-6 text-center">
                    {item.salePrice != null ? (
                      <div>
                        <span className="font-body text-sm font-medium text-[#C75050]">
                          {c}{item.salePrice.toFixed(2)}
                        </span>
                        {item.originalSalePrice != null && item.originalSalePrice !== item.salePrice && (
                          <span className="block font-body text-xs text-[#999] line-through">
                            {c}{item.originalSalePrice.toFixed(2)}
                          </span>
                        )}
                        <span className="block font-body text-xs text-[#999] line-through">
                          {c}{item.retailPrice.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-body text-sm font-medium text-black">
                        {c}{item.retailPrice.toFixed(2)}
                      </span>
                    )}
                  </td>

                  {/* Quantity */}
                  <td className="py-6">
                    <div className="flex justify-center">
                      <QuantityPicker
                        value={item.quantity}
                        onChange={(v) => onQuantityChange?.(item.id, v)}
                        size="compact"
                      />
                    </div>
                  </td>

                  {/* Total */}
                  <td className="py-6 text-right">
                    <span className="font-body text-sm font-semibold text-black">
                      {c}{total.toFixed(2)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="block redesign-sm:hidden">
        {items.map((item) => {
          const c = item.currency ?? currency;
          return (
            <div
              key={item.id}
              className="flex gap-4 py-4 border-b border-[#E0E0E0]"
            >
              {item.thumbnailSrc && (
                <div className="w-20 h-20 rounded-lg border border-[#E0E0E0] overflow-hidden flex-shrink-0">
                  <img
                    src={item.thumbnailSrc}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium text-black mb-1">
                  {item.name}
                </p>
                {item.variant && (
                  <p className="font-body text-xs text-[#888] mb-1">
                    {item.variant}
                  </p>
                )}
                <div className="flex items-baseline gap-1.5 mb-2">
                  {item.salePrice != null ? (
                    <>
                      <span className="font-body text-sm font-semibold text-[#C75050]">
                        {c}{item.salePrice.toFixed(2)}
                      </span>
                      {item.originalSalePrice != null && item.originalSalePrice !== item.salePrice && (
                        <span className="font-body text-xs text-[#999] line-through">
                          {c}{item.originalSalePrice.toFixed(2)}
                        </span>
                      )}
                      <span className="font-body text-xs text-[#999] line-through">
                        {c}{item.retailPrice.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="font-body text-sm font-semibold text-black">
                      {c}{item.retailPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <QuantityPicker
                    value={item.quantity}
                    onChange={(v) => onQuantityChange?.(item.id, v)}
                    size="compact"
                  />
                  <button
                    type="button"
                    onClick={() => setRemovingItem(item)}
                    className="font-body text-xs text-[#888] underline bg-transparent border-none p-0 cursor-pointer hover:text-[#C75050] transition-colors duration-fast"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart footer */}
      <div className="flex justify-end mt-8">
        <div className="max-w-[380px] w-full redesign-sm:max-w-[380px] max-sm:max-w-full">
          {(canApplyPromoCode || discountCodeValid || discountErrorMsgs.length > 0) ? (
            <div className="mb-5 rounded-lg border border-[#E0E0E0] bg-white p-4">
              <p className="mb-2 font-body text-sm font-medium text-black">
                Discount code or gift card
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={(evt) => {
                    setPromoCodeInput(evt.target.value.toUpperCase());
                    setPromoInputError("");
                  }}
                  onKeyDown={(evt) => {
                    if (evt.key === "Enter") {
                      evt.preventDefault();
                      handleApplyPromoCode();
                    }
                  }}
                  placeholder="Enter your promo code"
                  disabled={!canApplyPromoCode || promoApplying}
                  className="h-11 flex-1 rounded-md border border-[#CCC] px-3 text-sm outline-none focus:border-black focus:shadow-[0_0_0_1px_#000]"
                />
                <button
                  type="button"
                  onClick={handleApplyPromoCode}
                  disabled={!canApplyPromoCode || promoApplying}
                  className={cn(
                    "h-11 rounded-md px-4 text-sm font-medium transition-colors",
                    !canApplyPromoCode || promoApplying
                      ? "cursor-not-allowed bg-[#E0E0E0] text-[#888]"
                      : "bg-black text-white hover:bg-[#333]"
                  )}
                >
                  {promoApplying ? "Checking..." : "Apply"}
                </button>
              </div>
              {promoInputError && (
                <p className="mt-2 font-body text-xs text-[#C75050]">
                  {promoInputError}
                </p>
              )}
              {promoError ? (
                <p className="mt-2 font-body text-xs text-[#C75050]">
                  {promoError}
                </p>
              ) : null}
              {discountErrorMsgs.length > 0 && discountErrorMsgs.map((msg, idx) => (
                <p key={`promo-error-${idx}`} className="mt-2 font-body text-xs text-[#C75050]">
                  {msg}
                </p>
              ))}
              {discountCodeValid && (
                <p className="mt-2 font-body text-xs text-[#00AF32]">
                  Promo code {appliedPromoCode} applied successfully!
                </p>
              )}
            </div>
          ) : null}

          <div className="flex justify-between mb-2">
            <span className="font-body text-base text-black">Subtotal</span>
            <span className="font-body text-base font-semibold text-black">
              {currency}{subtotal.toFixed(2)}
            </span>
          </div>
          {promoCodeDiscount > 0 ? (
            <div className="flex justify-between mb-2">
              <span className="font-body text-sm text-[#666]">Promo Discount</span>
              <span className="font-body text-sm font-semibold text-[#4A7C59]">
                -{currency}{promoCodeDiscount.toFixed(2)}
              </span>
            </div>
          ) : null}
          <p className="font-body text-[13px] text-[#888] text-right mb-5">
            Taxes and shipping calculated at checkout
          </p>
          <button
            type="button"
            onClick={onCheckout}
            className="w-full h-[52px] rounded-lg border-none bg-black text-white font-body text-[15px] font-semibold cursor-pointer hover:bg-[#333] transition-colors duration-fast"
          >
            Check Out
          </button>
          <button
            type="button"
            onClick={onContinueShopping}
            className="block w-full text-center mt-3 font-body text-sm text-[#1A73E8] bg-transparent border-none p-0 cursor-pointer hover:underline"
          >
            Continue shopping
          </button>
        </div>
      </div>

      {/* Remove modal */}
      {removingItem && (
        <RemoveModal
          itemName={removingItem.name}
          onCancel={() => setRemovingItem(null)}
          onConfirm={handleRemoveConfirm}
        />
      )}
    </div>
  );
}

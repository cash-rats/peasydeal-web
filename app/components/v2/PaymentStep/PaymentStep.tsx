import { useState } from "react";
import { cn } from "~/lib/utils";

export type PaymentMethod = "stripe" | "paypal";

export interface PaymentStepProps {
  activeMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  /** Render prop for Stripe Elements or PayPal button */
  stripeContent?: React.ReactNode;
  paypalContent?: React.ReactNode;
  onPayNow?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

/* ─── Icons ─── */
function CreditCardIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="1" y="1" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 5H17" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 9H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function PayPalIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <text x="0" y="14" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="700" fill="#003087">PP</text>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="3" y="6" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1" />
      <path d="M5 6V4.5C5 3.12 6.12 2 7.5 2V2C8.88 2 10 3.12 10 4.5V6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path d="M10 2A8 8 0 0 1 18 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function PaymentStep({
  activeMethod,
  onMethodChange,
  stripeContent,
  paypalContent,
  onPayNow,
  loading = false,
  disabled = false,
  className,
}: PaymentStepProps) {
  return (
    <div className={className}>
      {/* Payment method tabs */}
      <div className="flex border border-[#E0E0E0] rounded-lg overflow-hidden mb-6">
        <button
          type="button"
          onClick={() => onMethodChange("stripe")}
          className={cn(
            "flex-1 h-12 flex items-center justify-center gap-2 bg-white border-none cursor-pointer font-body text-sm font-medium text-black transition-colors duration-fast",
            "border-r border-[#E0E0E0]",
            activeMethod === "stripe" &&
              "bg-[#F5F5F5] shadow-[inset_0_-2px_0_#000]"
          )}
        >
          <CreditCardIcon />
          Credit card
        </button>
        <button
          type="button"
          onClick={() => onMethodChange("paypal")}
          className={cn(
            "flex-1 h-12 flex items-center justify-center gap-2 bg-white border-none cursor-pointer font-body text-sm font-medium text-black transition-colors duration-fast",
            activeMethod === "paypal" &&
              "bg-[#F5F5F5] shadow-[inset_0_-2px_0_#000]"
          )}
        >
          <PayPalIcon />
          PayPal
        </button>
      </div>

      {/* Payment content */}
      {activeMethod === "stripe" && (
        <div className="border border-[#E0E0E0] rounded-lg p-5 bg-white">
          {stripeContent ?? (
            <p className="font-body text-sm text-[#888] text-center py-8">
              Stripe payment element will render here
            </p>
          )}
        </div>
      )}

      {activeMethod === "paypal" && (
        <div>
          {paypalContent ?? (
            <p className="font-body text-sm text-[#888] text-center py-8 border border-[#E0E0E0] rounded-lg">
              PayPal button will render here
            </p>
          )}
        </div>
      )}

      {/* Pay now button (Stripe) */}
      {activeMethod === "stripe" && (
        <button
          type="button"
          onClick={onPayNow}
          disabled={disabled || loading}
          className={cn(
            "w-full h-[52px] rounded-lg border-none font-body text-[15px] font-semibold transition-colors duration-fast mt-6",
            disabled
              ? "bg-[#CCC] text-white cursor-default"
              : loading
              ? "bg-black text-white cursor-wait"
              : "bg-black text-white cursor-pointer hover:bg-[#333]"
          )}
        >
          {loading ? <Spinner /> : "Pay now"}
        </button>
      )}

      {/* Security line */}
      <div className="flex items-center justify-center gap-1.5 mt-4">
        <span className="text-[#888]"><LockIcon /></span>
        <span className="font-body text-xs text-[#888]">
          All transactions are secure and encrypted
        </span>
      </div>
    </div>
  );
}

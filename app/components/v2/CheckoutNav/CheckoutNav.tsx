import { cn } from "~/lib/utils";

export interface CheckoutNavProps {
  returnLabel?: string;
  returnHref?: string;
  onReturn?: () => void;
  continueLabel?: string;
  onContinue?: () => void;
  continueDisabled?: boolean;
  loading?: boolean;
  className?: string;
}

function ChevronLeft() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="50" strokeDashoffset="25" opacity="0.3" />
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="50" strokeDashoffset="25" />
    </svg>
  );
}

export function CheckoutNav({
  returnLabel = "Return to cart",
  returnHref,
  onReturn,
  continueLabel = "Continue to shipping",
  onContinue,
  continueDisabled = false,
  loading = false,
  className,
}: CheckoutNavProps) {
  return (
    <div className={className}>
      {/* Navigation row */}
      <div className="flex flex-col-reverse redesign-sm:flex-row redesign-sm:justify-between redesign-sm:items-center gap-4 mt-8 pt-6">
        {/* Return link */}
        {returnHref ? (
          <a
            href={returnHref}
            className="flex items-center gap-1.5 font-body text-sm text-[#1A73E8] no-underline hover:underline justify-center redesign-sm:justify-start"
          >
            <ChevronLeft />
            {returnLabel}
          </a>
        ) : (
          <button
            type="button"
            onClick={onReturn}
            className="flex items-center gap-1.5 font-body text-sm text-[#1A73E8] bg-transparent border-none p-0 cursor-pointer hover:underline justify-center redesign-sm:justify-start w-full redesign-sm:w-auto"
          >
            <ChevronLeft />
            {returnLabel}
          </button>
        )}

        {/* Continue button */}
        <button
          type="button"
          onClick={onContinue}
          disabled={continueDisabled || loading}
          className={cn(
            "h-[52px] px-10 rounded-lg border-none font-body text-[15px] font-semibold cursor-pointer transition-colors duration-fast",
            "w-full redesign-sm:w-auto",
            continueDisabled
              ? "bg-[#CCC] text-white cursor-default"
              : "bg-black text-white hover:bg-[#333] active:bg-[#1A1A1A]",
            loading && "cursor-wait"
          )}
        >
          {loading ? <Spinner /> : continueLabel}
        </button>
      </div>

      {/* Policy links */}
      <div className="flex gap-4 mt-8 pt-4 border-t border-[#E0E0E0] flex-wrap">
        <a href="/policies/refund" className="font-body text-xs text-[#1A73E8] no-underline hover:underline">
          Refund Policy
        </a>
        <a href="/policies/shipping" className="font-body text-xs text-[#1A73E8] no-underline hover:underline">
          Shipping Policy
        </a>
        <a href="/policies/privacy" className="font-body text-xs text-[#1A73E8] no-underline hover:underline">
          Privacy Policy
        </a>
        <a href="/policies/terms" className="font-body text-xs text-[#1A73E8] no-underline hover:underline">
          Terms of Service
        </a>
      </div>
    </div>
  );
}

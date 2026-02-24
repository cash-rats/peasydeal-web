import { cn } from "~/lib/utils";

export interface ExpressCheckoutProps {
  onShopPay?: () => void;
  onPayPal?: () => void;
  onGooglePay?: () => void;
  className?: string;
}

function ShopPayLogo() {
  return (
    <svg width="60" height="22" viewBox="0 0 60 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Shop Pay">
      <text x="0" y="16" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="700" fill="white">Shop Pay</text>
    </svg>
  );
}

function PayPalLogo() {
  return (
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PayPal">
      <text x="0" y="15" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="700" fill="#003087">PayPal</text>
    </svg>
  );
}

function GPayLogo() {
  return (
    <svg width="42" height="20" viewBox="0 0 42 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Google Pay">
      <text x="0" y="15" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="600" fill="white">G Pay</text>
    </svg>
  );
}

export function ExpressCheckout({
  onShopPay,
  onPayPal,
  onGooglePay,
  className,
}: ExpressCheckoutProps) {
  return (
    <div className={cn("mb-7", className)}>
      {/* Express buttons */}
      <div className="flex gap-2 mb-0">
        {/* Shop Pay */}
        <button
          type="button"
          onClick={onShopPay}
          className="flex-1 h-12 rounded-md border-none bg-[#5A31F4] text-white flex items-center justify-center cursor-pointer hover:bg-[#4A28CC] transition-colors duration-fast"
        >
          <ShopPayLogo />
        </button>

        {/* PayPal */}
        <button
          type="button"
          onClick={onPayPal}
          className="flex-1 h-12 rounded-md border-none bg-[#FFC439] text-black flex items-center justify-center cursor-pointer hover:bg-[#E8B333] transition-colors duration-fast"
        >
          <PayPalLogo />
        </button>

        {/* Google Pay */}
        <button
          type="button"
          onClick={onGooglePay}
          className="flex-1 h-12 rounded-md border-none bg-black text-white flex items-center justify-center cursor-pointer hover:bg-[#333] transition-colors duration-fast"
        >
          <GPayLogo />
        </button>
      </div>

      {/* OR divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-[#E0E0E0]" />
        <span className="font-body text-xs text-[#999] uppercase tracking-wider whitespace-nowrap">
          OR
        </span>
        <div className="flex-1 h-px bg-[#E0E0E0]" />
      </div>
    </div>
  );
}

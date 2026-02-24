import { cn } from "~/lib/utils";

export interface OrderItemSummary {
  id: string;
  name: string;
  variant?: string;
  thumbnailSrc?: string;
  quantity: number;
  price: number;
}

export interface ShippingInfo {
  name: string;
  address: string;
  method?: string;
}

export interface PaymentSuccessProps {
  orderNumber: string;
  items: OrderItemSummary[];
  shippingInfo?: ShippingInfo;
  billingInfo?: { name: string; address: string };
  total: number;
  currency?: string;
  onTrackOrder?: () => void;
  onContinueShopping?: () => void;
  className?: string;
}

export interface PaymentFailedProps {
  errorTitle?: string;
  errorMessage?: string;
  onTryAgain?: () => void;
  onContactSupport?: () => void;
  className?: string;
}

/* ─── Icons ─── */
function CheckmarkCircle() {
  return (
    <div className="w-16 h-16 rounded-full bg-[#4A7C59] flex items-center justify-center mx-auto mb-6 animate-[checkmark-in_400ms_cubic-bezier(0.175,0.885,0.32,1.275)]">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M6 14L11.5 19.5L22 8.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ErrorCircle() {
  return (
    <div className="w-16 h-16 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-6">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M8 8L20 20M20 8L8 20" stroke="#C75050" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ─── Success ─── */
export function PaymentSuccess({
  orderNumber,
  items,
  shippingInfo,
  billingInfo,
  total,
  currency = "$",
  onTrackOrder,
  onContinueShopping,
  className,
}: PaymentSuccessProps) {
  return (
    <div
      className={cn(
        "max-w-[720px] mx-auto py-16 px-4 redesign-sm:px-12 text-center",
        className
      )}
    >
      <CheckmarkCircle />
      <h1 className="font-heading text-[32px] font-bold text-black mb-2">
        Thank you!
      </h1>
      <p className="font-body text-sm text-[#888] mb-8">
        Order {orderNumber}
      </p>

      {/* Order details card */}
      <div className="bg-[#FAFAFA] rounded-xl p-6 redesign-sm:p-8 text-left mb-8">
        <h2 className="font-body text-base font-semibold text-black mb-4 pb-3 border-b border-[#E0E0E0]">
          Order details
        </h2>

        {/* Items */}
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              {item.thumbnailSrc && (
                <div className="relative w-14 h-14 rounded-lg border border-[#E0E0E0] overflow-hidden flex-shrink-0 bg-white">
                  <img
                    src={item.thumbnailSrc}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-black/70 text-white font-body text-[10px] font-semibold flex items-center justify-center px-1">
                    {item.quantity}
                  </span>
                </div>
              )}
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
              <span className="font-body text-sm font-medium text-black flex-shrink-0">
                {currency}{item.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between items-baseline mt-4 pt-4 border-t border-[#E0E0E0]">
          <span className="font-body text-base font-semibold text-black">
            Total
          </span>
          <span className="font-body text-lg font-bold text-black">
            {currency}{total.toFixed(2)}
          </span>
        </div>

        {/* Shipping / Billing info */}
        {(shippingInfo || billingInfo) && (
          <div className="grid grid-cols-1 redesign-sm:grid-cols-2 gap-6 mt-5 pt-5 border-t border-[#E0E0E0]">
            {shippingInfo && (
              <div>
                <p className="font-body text-xs text-[#888] mb-1.5">
                  Shipping address
                </p>
                <p className="font-body text-sm text-black leading-relaxed">
                  {shippingInfo.name}
                  <br />
                  {shippingInfo.address}
                </p>
                {shippingInfo.method && (
                  <>
                    <p className="font-body text-xs text-[#888] mb-1.5 mt-4">
                      Shipping method
                    </p>
                    <p className="font-body text-sm text-black">
                      {shippingInfo.method}
                    </p>
                  </>
                )}
              </div>
            )}
            {billingInfo && (
              <div>
                <p className="font-body text-xs text-[#888] mb-1.5">
                  Billing address
                </p>
                <p className="font-body text-sm text-black leading-relaxed">
                  {billingInfo.name}
                  <br />
                  {billingInfo.address}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center flex-wrap">
        <button
          type="button"
          onClick={onTrackOrder}
          className="h-12 px-8 rounded-lg border-none bg-black text-white font-body text-sm font-semibold cursor-pointer hover:bg-[#333] transition-colors duration-fast"
        >
          Track Order
        </button>
        <button
          type="button"
          onClick={onContinueShopping}
          className="h-12 px-8 rounded-lg border-[1.5px] border-[#E0E0E0] bg-white text-black font-body text-sm font-semibold cursor-pointer hover:bg-[#F5F5F5] transition-colors duration-fast"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

/* ─── Failed ─── */
export function PaymentFailed({
  errorTitle = "Payment failed",
  errorMessage = "We couldn't process your payment. Please check your payment details and try again, or use a different payment method.",
  onTryAgain,
  onContactSupport,
  className,
}: PaymentFailedProps) {
  return (
    <div
      className={cn(
        "max-w-[560px] mx-auto py-16 px-4 redesign-sm:px-12 text-center",
        className
      )}
    >
      <ErrorCircle />
      <h1 className="font-heading text-[28px] font-bold text-black mb-3">
        {errorTitle}
      </h1>
      <p className="font-body text-sm text-[#666] leading-relaxed mb-8">
        {errorMessage}
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <button
          type="button"
          onClick={onTryAgain}
          className="h-12 px-8 rounded-lg border-none bg-black text-white font-body text-sm font-semibold cursor-pointer hover:bg-[#333] transition-colors duration-fast"
        >
          Try Again
        </button>
        <button
          type="button"
          onClick={onContactSupport}
          className="h-12 px-8 rounded-lg border-[1.5px] border-[#E0E0E0] bg-white text-black font-body text-sm font-semibold cursor-pointer hover:bg-[#F5F5F5] transition-colors duration-fast"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
}

/* ─── Loading Skeleton ─── */
export function PaymentLoadingSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "max-w-[720px] mx-auto py-16 px-4 redesign-sm:px-12",
        className
      )}
    >
      {/* Checkmark placeholder */}
      <div className="w-16 h-16 rounded-full mx-auto mb-6 skeleton" />
      {/* Title placeholder */}
      <div className="w-60 h-6 mx-auto mb-2 skeleton" />
      {/* Order number placeholder */}
      <div className="w-44 h-3.5 mx-auto mb-8 skeleton" />
      {/* Card placeholder */}
      <div className="w-full h-80 rounded-xl skeleton" />
    </div>
  );
}

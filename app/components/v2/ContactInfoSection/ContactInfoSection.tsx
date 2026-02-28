import { cn } from "~/lib/utils";
import { CheckoutInput } from "~/components/v2/CheckoutInput";

export interface ContactInfoSectionProps {
  email: string;
  onEmailChange: (value: string) => void;
  emailError?: string;
  marketingOptIn?: boolean;
  onMarketingOptInChange?: (checked: boolean) => void;
  onLoginClick?: () => void;
  className?: string;
}

function CheckIcon() {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ContactInfoSection({
  email,
  onEmailChange,
  emailError,
  marketingOptIn = false,
  onMarketingOptInChange,
  onLoginClick,
  className,
}: ContactInfoSectionProps) {
  return (
    <section className={className}>
      {/* Header */}
      <div className="flex justify-between items-baseline mb-4">
        <h2 className="font-body text-lg font-semibold text-black">
          Contact
        </h2>
        {onLoginClick && (
          <button
            type="button"
            onClick={onLoginClick}
            className="font-body text-[13px] text-[#1A73E8] bg-transparent border-none p-0 cursor-pointer hover:underline"
          >
            Log in
          </button>
        )}
      </div>

      {/* Email input */}
      <CheckoutInput
        id="email"
        name="email"
        label="Email"
        type="email"
        value={email}
        onChange={onEmailChange}
        error={emailError}
        required
        className="mb-3"
      />

      {/* Marketing opt-in */}
      <label className="flex items-start gap-2.5 mb-7 cursor-pointer">
        <span
          className={cn(
            "w-[18px] h-[18px] rounded border-[1.5px] flex-shrink-0 mt-px flex items-center justify-center transition-colors duration-fast",
            marketingOptIn
              ? "bg-black border-black text-white"
              : "bg-white border-[#CCC]"
          )}
          onClick={(e) => {
            e.preventDefault();
            onMarketingOptInChange?.(!marketingOptIn);
          }}
        >
          {marketingOptIn && <CheckIcon />}
        </span>
        <span
          className="font-body text-[13px] text-[#666] leading-relaxed"
          onClick={() => onMarketingOptInChange?.(!marketingOptIn)}
        >
          Email me with news and offers
        </span>
      </label>
    </section>
  );
}

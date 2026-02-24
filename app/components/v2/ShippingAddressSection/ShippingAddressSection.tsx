import { cn } from "~/lib/utils";
import { CheckoutInput, CheckoutSelect } from "~/components/v2/CheckoutInput";

export interface ShippingAddress {
  country: string;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
}

export interface ShippingAddressSectionProps {
  address: ShippingAddress;
  onChange: (field: keyof ShippingAddress, value: string) => void;
  errors?: Partial<Record<keyof ShippingAddress, string>>;
  countries?: Array<{ label: string; value: string }>;
  states?: Array<{ label: string; value: string }>;
  saveInfo?: boolean;
  onSaveInfoChange?: (checked: boolean) => void;
  className?: string;
}

function CheckIcon() {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const DEFAULT_COUNTRIES = [
  { label: "United States", value: "US" },
  { label: "Canada", value: "CA" },
  { label: "United Kingdom", value: "GB" },
  { label: "Australia", value: "AU" },
];

export function ShippingAddressSection({
  address,
  onChange,
  errors = {},
  countries = DEFAULT_COUNTRIES,
  states = [],
  saveInfo = false,
  onSaveInfoChange,
  className,
}: ShippingAddressSectionProps) {
  return (
    <section className={className}>
      <h2 className="font-body text-lg font-semibold text-black mb-4">
        Shipping address
      </h2>

      <div className="flex flex-col gap-3">
        {/* Country */}
        <CheckoutSelect
          label="Country/Region"
          value={address.country}
          onChange={(v) => onChange("country", v)}
          options={countries}
          error={errors.country}
        />

        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <CheckoutInput
            label="First name"
            value={address.firstName}
            onChange={(v) => onChange("firstName", v)}
            error={errors.firstName}
          />
          <CheckoutInput
            label="Last name"
            value={address.lastName}
            onChange={(v) => onChange("lastName", v)}
            error={errors.lastName}
          />
        </div>

        {/* Company (optional) */}
        <CheckoutInput
          label="Company"
          value={address.company}
          onChange={(v) => onChange("company", v)}
          optional
        />

        {/* Address */}
        <CheckoutInput
          label="Address"
          value={address.address}
          onChange={(v) => onChange("address", v)}
          error={errors.address}
        />

        {/* City */}
        <CheckoutInput
          label="City"
          value={address.city}
          onChange={(v) => onChange("city", v)}
          error={errors.city}
        />

        {/* State / Postcode row */}
        <div className="grid grid-cols-1 redesign-sm:grid-cols-3 gap-3">
          <CheckoutSelect
            label="Country"
            value={address.country}
            onChange={(v) => onChange("country", v)}
            options={countries}
          />
          {states.length > 0 ? (
            <CheckoutSelect
              label="State"
              value={address.state}
              onChange={(v) => onChange("state", v)}
              options={states}
              error={errors.state}
            />
          ) : (
            <CheckoutInput
              label="State"
              value={address.state}
              onChange={(v) => onChange("state", v)}
              error={errors.state}
            />
          )}
          <CheckoutInput
            label="Postcode"
            value={address.postcode}
            onChange={(v) => onChange("postcode", v)}
            error={errors.postcode}
          />
        </div>

        {/* Phone */}
        <CheckoutInput
          label="Phone"
          type="tel"
          value={address.phone}
          onChange={(v) => onChange("phone", v)}
          error={errors.phone}
          optional
        />
      </div>

      {/* Save info checkbox */}
      {onSaveInfoChange && (
        <label className="flex items-center gap-2.5 mt-5 cursor-pointer">
          <span
            className={cn(
              "w-[18px] h-[18px] rounded border-[1.5px] flex-shrink-0 flex items-center justify-center transition-colors duration-fast",
              saveInfo
                ? "bg-black border-black text-white"
                : "bg-white border-[#CCC]"
            )}
            onClick={(e) => {
              e.preventDefault();
              onSaveInfoChange(!saveInfo);
            }}
          >
            {saveInfo && <CheckIcon />}
          </span>
          <span
            className="font-body text-[13px] text-[#666]"
            onClick={() => onSaveInfoChange(!saveInfo)}
          >
            Save this information for next time
          </span>
        </label>
      )}
    </section>
  );
}

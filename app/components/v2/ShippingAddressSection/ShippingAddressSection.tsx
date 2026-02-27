import { type ChangeEvent, useEffect, useRef } from 'react';
import { FiHelpCircle } from 'react-icons/fi';
import MoonLoader from 'react-spinners/MoonLoader';

import TextDropdownField from '~/components/TextDropdownField';
import type { Option as DropdownOption } from '~/components/TextDropdownField';
import { Button } from '~/components/ui/button';
import { Alert, AlertDescription } from '~/components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { cn } from '~/lib/utils';
import type { AddressOption } from '~/routes/api.fetch-address-options-by-postal/types';
import { useAddressLookup } from '~/routes/checkout/hooks';
import { CheckoutInput, CheckoutSelect } from '~/components/v2/CheckoutInput';

export interface ShippingAddress {
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  address2: string;
  city: string;
  postcode: string;
  phone: string;
}

export interface ShippingAddressSectionProps {
  address: ShippingAddress;
  onChange: (field: keyof ShippingAddress, value: string) => void;
  errors?: Partial<Record<keyof ShippingAddress, string>>;
  countries?: Array<{ label: string; value: string }>;
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
  saveInfo = false,
  onSaveInfoChange,
  className,
}: ShippingAddressSectionProps) {
  const {
    options,
    setPostal,
    fetchOptions,
    isLoading,
    hasNoResults,
  } = useAddressLookup();

  const isLoadingRef = useRef<boolean>(false);
  const lastRequestedPostalRef = useRef<string>('');
  const pendingPostalRef = useRef<string>('');
  const fetchWhenIdleRef = useRef<boolean>(false);
  const suppressNextAutoLookupRef = useRef<boolean>(false);
  const debounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    if (address.country !== 'GB') return;

    const normalized = (address.postcode ?? '').trim().replace(/\s+/g, ' ');

    if (suppressNextAutoLookupRef.current) {
      suppressNextAutoLookupRef.current = false;
      fetchWhenIdleRef.current = false;
      pendingPostalRef.current = normalized;
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      return;
    }

    if (normalized.length < 3) {
      pendingPostalRef.current = '';
      lastRequestedPostalRef.current = '';
      fetchWhenIdleRef.current = false;
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      return;
    }

    pendingPostalRef.current = normalized;

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      const pendingPostal = pendingPostalRef.current;
      if (!pendingPostal) return;
      if (pendingPostal === lastRequestedPostalRef.current) return;

      if (isLoadingRef.current) {
        fetchWhenIdleRef.current = true;
        return;
      }

      fetchWhenIdleRef.current = false;
      lastRequestedPostalRef.current = pendingPostal;
      fetchOptions(pendingPostal);
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [address.country, address.postcode, fetchOptions]);

  useEffect(() => {
    if (!isLoading && fetchWhenIdleRef.current) {
      const pendingPostal = pendingPostalRef.current;
      if (!pendingPostal) return;
      if (pendingPostal.length < 3) return;
      if (pendingPostal === lastRequestedPostalRef.current) return;

      fetchWhenIdleRef.current = false;
      lastRequestedPostalRef.current = pendingPostal;
      fetchOptions(pendingPostal);
    }
  }, [isLoading, fetchOptions]);

  const handleChangePostcode = (evt: ChangeEvent<HTMLInputElement>) => {
    onChange('postcode', evt.target.value);
    setPostal(evt.target.value);
  };

  const handleSearchAddress = () => {
    fetchOptions(address.postcode);
  };

  const handleSelectOption = (option: DropdownOption<AddressOption>) => {
    suppressNextAutoLookupRef.current = true;
    setPostal(option.value.postal);
    onChange('postcode', option.value.postal);
    onChange('address', option.value.line1);
    onChange(
      'address2',
      [option.value.line2, option.value.line3, option.value.county, option.value.country]
        .filter(Boolean)
        .join(', '),
    );
    onChange('city', option.value.city);
  };

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

        {address.country === 'GB' ? (
          <div>
            <TextDropdownField<AddressOption>
              options={options}
              required
              id="postcode"
              label="Postcode"
              name="postcode"
              value={address.postcode}
              inputClassName="h-12 bg-white text-sm"
              onSelect={handleSelectOption}
              onChange={handleChangePostcode}
              preventSelectChangeValue
              disabled={isLoading}
              endAdornment={(
                <>
                  {isLoading ? (
                    <MoonLoader size={20} cssOverride={{ color: '#009378', backgroundColor: 'transparent' }} />
                  ) : null}
                  {!isLoading && hasNoResults ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FiHelpCircle className="h-5 w-5 text-emerald-600" />
                        </TooltipTrigger>
                        <TooltipContent>
                          no address suggestions
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : null}
                </>
              )}
            />
            <div className="flex items-center py-2 text-sm gap-2">
              <div className="max-w-[13.5rem]">
                <Button
                  type="button"
                  disabled={!address.postcode || isLoading}
                  onClick={handleSearchAddress}
                >
                  {isLoading ? 'Checking...' : 'Address lookup'}
                </Button>
              </div>
            </div>
            {!isLoading && hasNoResults ? (
              <Alert className="items-start gap-2">
                <FiHelpCircle className="h-4 w-4 mt-[2px] text-emerald-700" />
                <AlertDescription className="font-normal text-emerald-800">
                  Address not found in the dropdown. Please complete the address manually below.
                </AlertDescription>
              </Alert>
            ) : null}
          </div>
        ) : (
          <CheckoutInput
            label="Postcode"
            value={address.postcode}
            onChange={(v) => onChange('postcode', v)}
            error={errors.postcode}
          />
        )}

        {/* Address */}
        <CheckoutInput
          label="Address"
          value={address.address}
          onChange={(v) => onChange('address', v)}
          error={errors.address}
        />

        <CheckoutInput
          label="Address line 2"
          value={address.address2}
          onChange={(v) => onChange('address2', v)}
          optional
        />

        {/* City */}
        <CheckoutInput
          label="City"
          value={address.city}
          onChange={(v) => onChange('city', v)}
          error={errors.city}
        />

        {/* Phone */}
        <CheckoutInput
          label="Phone"
          type="tel"
          value={address.phone}
          onChange={(v) => onChange('phone', v)}
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

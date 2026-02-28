import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import PhoneInput from 'react-phone-input-2';
import type { CountryData } from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

import { cn } from '~/lib/utils';
import type { AddressOption } from '~/routes/api.fetch-address-options-by-postal/types';
import { useAddressLookup } from '~/routes/checkout/hooks';
import { Button } from '~/components/v2/Button';
import {
  CheckoutAutocompleteInput,
  type CheckoutAutocompleteOption,
  CheckoutInput,
  CheckoutSelect,
} from '~/components/v2/CheckoutInput';
import { FiHelpCircle } from 'react-icons/fi';

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

export interface ShippingAddressChangeMeta {
  countryData?: CountryData;
}

export interface ShippingAddressSectionProps {
  address: ShippingAddress;
  onChange: (
    field: keyof ShippingAddress,
    value: string,
    meta?: ShippingAddressChangeMeta,
  ) => void;
  phoneCountryCode?: string;
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
  phoneCountryCode,
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
  const [phoneFocused, setPhoneFocused] = useState(false);

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

  const handleChangePostcode = (postcode: string) => {
    onChange('postcode', postcode);
    setPostal(postcode);
  };

  const handleSearchAddress = () => {
    fetchOptions(address.postcode);
  };

  const handleSelectOption = (
    option: CheckoutAutocompleteOption<AddressOption>,
  ) => {
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

  const phoneInfoText = 'Phone number is for shipping purpose only.';
  const normalizedPhoneCountryCode = (
    phoneCountryCode?.trim() || address.country || 'GB'
  ).toLowerCase();
  const phoneBorderColor = errors.phone
    ? '#C75050'
    : phoneFocused
      ? '#000000'
      : '#CCCCCC';

  const isCountryData = (data: CountryData | {}): data is CountryData => (
    typeof (data as CountryData).name === 'string'
    && typeof (data as CountryData).dialCode === 'string'
    && typeof (data as CountryData).countryCode === 'string'
  );

  const handlePhoneChange = (
    value: string,
    countryData: CountryData | {},
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (event?.target?.setCustomValidity) {
      event.target.setCustomValidity('');
    }

    onChange(
      'phone',
      value,
      isCountryData(countryData) ? { countryData } : undefined,
    );
  };

  const handlePhoneKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    const allowKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Home',
      'End',
    ];

    if (allowKeys.includes(event.key)) return;
    if (/^\d$/.test(event.key)) return;
    if (event.key === '+' && (event.currentTarget.selectionStart ?? 0) === 0) return;

    event.preventDefault();
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
            <CheckoutAutocompleteInput<AddressOption>
              options={options}
              required
              id="postcode"
              label="Postcode"
              name="postcode"
              value={address.postcode}
              error={errors.postcode}
              onSelect={handleSelectOption}
              onChange={handleChangePostcode}
              disabled={isLoading}
              loading={isLoading}
            />

            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="font-body text-xs text-[#888]">
                Enter at least 3 characters to auto-search.
              </p>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={!address.postcode || isLoading}
                isLoading={isLoading}
                onClick={handleSearchAddress}
                className="h-11 px-4 text-sm font-medium"
              >
                Search address
              </Button>
            </div>

            {!isLoading && hasNoResults ? (
              <p className="mt-2 font-body text-xs text-[#666]">
                No address suggestions found. Continue entering address manually.
              </p>
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
        <div className="relative">
          <label
            htmlFor="phone"
            className={cn(
              'absolute left-[86px] top-2 z-[2] font-body text-[11px] font-normal',
              errors.phone ? 'text-[#C75050]' : 'text-[#999]',
            )}
          >
            <span className="inline-flex items-center">
              <span>Phone</span>
              <span className="ml-1.5 inline-flex items-center">
                <FiHelpCircle
                  className="h-[14px] w-[14px] text-[#CCC] cursor-help"
                  aria-label={phoneInfoText}
                  title={phoneInfoText}
                />
              </span>
            </span>
          </label>
          <PhoneInput
            country={normalizedPhoneCountryCode}
            value={address.phone}
            onChange={handlePhoneChange}
            specialLabel=""
            countryCodeEditable
            enableSearch
            inputProps={{
              id: 'phone',
              name: 'phone',
              required: true,
              onFocus: () => setPhoneFocused(true),
              onBlur: () => setPhoneFocused(false),
              onKeyDown: handlePhoneKeyDown,
            }}
            containerStyle={{ width: '100%' }}
            buttonStyle={{
              width: '72px',
              height: '48px',
              borderTopLeftRadius: '6px',
              borderBottomLeftRadius: '6px',
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              border: `1px solid ${phoneBorderColor}`,
              borderRight: `1px solid ${phoneBorderColor}`,
              backgroundColor: '#FFFFFF',
              zIndex: 1,
            }}
            inputStyle={{
              width: '100%',
              height: '48px',
              borderRadius: '6px',
              borderColor: phoneBorderColor,
              borderWidth: '1px',
              borderStyle: 'solid',
              boxShadow: errors.phone
                ? '0 0 0 1px #C75050'
                : phoneFocused
                  ? '0 0 0 1px #000000'
                  : 'none',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 400,
              color: '#000000',
              backgroundColor: '#FFFFFF',
              paddingTop: '20px',
              paddingBottom: '4px',
              paddingRight: '14px',
              paddingLeft: '86px',
            }}
            dropdownStyle={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
            }}
          />
          {errors.phone && (
            <p className="flex items-center gap-1 mt-1 font-body text-xs font-normal text-[#C75050]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1" />
                <path d="M6 3.5V6.5M6 8V8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
              {errors.phone}
            </p>
          )}
        </div>
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

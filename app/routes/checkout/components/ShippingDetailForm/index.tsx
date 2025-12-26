import { useEffect, useRef, type ChangeEvent } from 'react';
import { FiHelpCircle } from 'react-icons/fi';
import MoonLoader from 'react-spinners/MoonLoader';

import TextDropdownField from '~/components/TextDropdownField';
import type { Option as DropdownOption } from '~/components/TextDropdownField';

import { Button } from '~/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';

import type { AddressOption as Option } from '~/routes/api.fetch-address-options-by-postal/types';
import { useAddressLookup } from '~/routes/checkout/hooks';
import type { ShippingDetailFormType } from '../../types';

interface ShippingDetailFormProps {
  values: ShippingDetailFormType;
  onSelectAddress?: (option: Option) => void;
}

// When user finish typing postal code, request remote API for address autocompletion.
// - [ ] display loading UI when fetching address options.
// - [ ] give default value when done loading address options.
const ShippingDetailForm = ({ values, onSelectAddress = () => { } }: ShippingDetailFormProps) => {
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
  const debounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    const normalized = (values.postal ?? '').trim().replace(/\s+/g, ' ');

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
    }, 800);

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [values.postal, fetchOptions]);

  useEffect(() => {
    if (isLoading) return;
    if (!fetchWhenIdleRef.current) return;
    const pendingPostal = pendingPostalRef.current;
    if (!pendingPostal) return;
    if (pendingPostal.length < 3) return;
    if (pendingPostal === lastRequestedPostalRef.current) return;

    fetchWhenIdleRef.current = false;
    lastRequestedPostalRef.current = pendingPostal;
    fetchOptions(pendingPostal);
  }, [isLoading, fetchOptions]);

  // Deprecate this method in favor of lookup address button.
  const handleChangePostal = (evt: ChangeEvent<HTMLInputElement>) => {
    setPostal(evt.target.value);
  };
  const handleSearchAddress = () => {
    fetchOptions(values.postal);
  }

  const handleSelectOption = (option: DropdownOption<Option>) => {
    setPostal(option.value.postal);
    onSelectAddress({ ...option.value });
  };

  const handleInputChange = () => {
    // form onChange handler handles state updates
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-5 mb-3">
        <div>
          <TextDropdownField<Option>
            options={options}
            required
            id="postalcode"
            label="Postcode"
            name="postal"
            value={values.postal}
            inputClassName="h-auto bg-white py-3 text-sm"
            onSelect={handleSelectOption}
            onChange={handleChangePostal}
            preventSelectChangeValue
            disabled={isLoading}
            endAdornment={(
              <>
                {
                  isLoading && (
                    <MoonLoader size={20} cssOverride={{ color: '#009378', backgroundColor: 'transparent' }} />
                  )
                }

                {
                  !isLoading &&
                  hasNoResults && (
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
                  )
                }
              </>
            )}
          />

          <div className="flex items-center m-0 py-2 text-sm text-white font-light gap-2">
            <div className="max-w-[13.5rem] ">
              <Button
                type="button"
                disabled={!values.postal || isLoading}
                onClick={handleSearchAddress}
              >
                {
                  isLoading
                    ? 'Checking...'
                    : 'Address lookup'
                }
              </Button>
            </div>
            {
              !isLoading &&
              hasNoResults && (
                <p className="ml-4">
                  No address found, please input address manually.
                </p>
              )
            }
          </div>
        </div>

      </div>

      {/* Name */}
      <div className="grid grid-cols-2 gap-5 mb-3">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="firstname"
            className="text-sm font-medium text-slate-700"
          >
            First Name
          </label>
          <input
            required
            id="firstname"
            name="firstname"
            aria-describedby="firstname"
            className="block w-full rounded-md border border-input bg-white px-3 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={values.firstname}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="lastname"
            className="text-sm font-medium text-slate-700"
          >
            Last Name
          </label>
          <input
            required
            id="lastname"
            name="lastname"
            aria-describedby="lastname"
            className="block w-full rounded-md border border-input bg-white px-3 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={values.lastname}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Address line */}
      <div className="grid grid-cols-1 gap-5 mb-3">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="address1"
            className="text-sm font-medium text-slate-700"
          >
            Address Line 1
          </label>
          <input
            autoComplete="off"
            required
            id="address1"
            name="address1"
            aria-describedby="address1"
            className="block w-full rounded-md border border-input bg-white px-3 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={values.address1}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Address line 2 (optional) */}
      <div className="grid grid-cols-1 gap-5 mb-3">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="address2"
            className="text-sm font-medium text-slate-700"
          >
            Address Line 2 (County, Country)
          </label>
          <input
            autoComplete="off"
            id="address2"
            name="address2"
            aria-describedby="address2"
            className="block w-full rounded-md border border-input bg-white px-3 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={values.address2}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Postal code & City */}
      <div className="grid grid-cols-1 gap-5 mb-3">
        {/* Might need a dropdown list for city selection for GB */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="city"
            className="text-sm font-medium text-slate-700"
          >
            City
          </label>
          <input
            required
            autoComplete="off"
            id="city"
            name="city"
            aria-describedby="city"
            className="block w-full rounded-md border border-input bg-white px-3 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={values.city}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </>
  );
};

export default ShippingDetailForm;

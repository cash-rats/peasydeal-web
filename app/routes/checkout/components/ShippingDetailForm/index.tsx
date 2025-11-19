import { useEffect, useReducer } from 'react';
import type { ChangeEvent } from 'react';
import { type LinksFunction, useFetcher } from 'react-router';
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

import type { Option } from '~/routes/checkout.fetch-address-options-by-postal/types';
import styles from './styles/ShippingDetailForm.css?url';
import { inistialState, addressOptionsReducer, AddressOptionsActionTypes } from './reducer';
import type { ShippingDetailFormType } from '../../types';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface ShippingDetailFormProps {
  values: ShippingDetailFormType;
  onSelectAddress?: (option: Option) => void;
}

// When user finish typing postal code, request remote API for address autocompletion.
// - [ ] display loading UI when fetching address options.
// - [ ] give default value when done loading address options.
const ShippingDetailForm = ({ values, onSelectAddress = () => { } }: ShippingDetailFormProps) => {
  const loadAddrFetcher = useFetcher();
  const [state, dispatch] = useReducer(addressOptionsReducer, inistialState);

  useEffect(() => {
    if (
      loadAddrFetcher.state === 'idle' &&
      Array.isArray(loadAddrFetcher.data)
    ) {
      dispatch({
        type: AddressOptionsActionTypes.update_all_options,
        payload: loadAddrFetcher.data,
      });
    }
  }, [loadAddrFetcher.state, loadAddrFetcher.data]);

  const loadAddrOptions = (postal: string) => {
    loadAddrFetcher.submit(
      { postal },
      { method: 'post', action: '/checkout/fetch-address-options-by-postal' }
    );
  };

  // Deprecate this method in favor of lookup address button.
  const handleChangePostal = (evt: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: AddressOptionsActionTypes.on_change_postal,
      payload: evt.target.value,
    })
  };
  const handleSearchAddress = () => {
    loadAddrOptions(state.postal);
  }

  const handleSelectOption = (option: DropdownOption<Option>) => {
    onSelectAddress({ ...option.value });
  };

  return (
    <>
      <div className="shipping-form-fields field--2">
        <div>
          <TextDropdownField<Option>
            options={state.options}
            required
            id="postalcode"
            label="postcode"
            name="postal"
            value={values.postal}
            onSelect={handleSelectOption}
            onChange={handleChangePostal}
            preventSelectChangeValue
            disabled={loadAddrFetcher.state !== 'idle'}
            endAdornment={(
              <>
                {
                  loadAddrFetcher.state !== 'idle' && (
                    <MoonLoader size={20} cssOverride={{ color: '#009378', backgroundColor: 'transparent' }} />
                  )
                }

                {
                  loadAddrFetcher.state === 'idle' &&
                  Array.isArray(loadAddrFetcher.data) &&
                  state.options.length === 0 && (
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
                disabled={!values.postal || loadAddrFetcher.state !== 'idle'}
                onClick={handleSearchAddress}
              >
                {
                  loadAddrFetcher.state !== 'idle'
                    ? 'Checking...'
                    : 'Address lookup'
                }
              </Button>
            </div>
            {
              loadAddrFetcher.state === 'idle' &&
              Array.isArray(loadAddrFetcher.data) &&
              state.options.length === 0 && (
                <p className="ml-4">
                  No address found, please input address manually.
                </p>
              )
            }
          </div>
        </div>

      </div>

      {/* Name */}
      <div className="shipping-form-fields fields--2">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="firstname"
            className="text-sm font-medium text-slate-700"
          >
            firstname
          </label>
          <input
            required
            id="firstname"
            name="firstname"
            aria-describedby="firstname"
            className="block w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            defaultValue={values.firstname}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="lastname"
            className="text-sm font-medium text-slate-700"
          >
            lastname
          </label>
          <input
            required
            id="lastname"
            name="lastname"
            aria-describedby="lastname"
            className="block w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            defaultValue={values.lastname}
          />
        </div>
      </div>

      {/* Address line */}
      <div className="shipping-form-fields field--1">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="address1"
            className="text-sm font-medium text-slate-700"
          >
            address line 1
          </label>
          <input
            autoComplete="off"
            required
            id="address1"
            name="address1"
            aria-describedby="address1"
            className="block w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            defaultValue={values.address1}
          />
        </div>
      </div>

      {/* Address line 2 (optional) */}
      <div className="shipping-form-fields field--1">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="address2"
            className="text-sm font-medium text-slate-700"
          >
            address line 2 (county, country)
          </label>
          <input
            autoComplete="off"
            id="address2"
            name="address2"
            aria-describedby="address2"
            className="block w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            defaultValue={values.address2}
          />
        </div>
      </div>

      {/* Postal code & City */}
      <div className="shipping-form-fields fields--1">
        {/* Might need a dropdown list for city selection for GB */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="city"
            className="text-sm font-medium text-slate-700"
          >
            city
          </label>
          <input
            required
            autoComplete="off"
            id="city"
            name="city"
            aria-describedby="city"
            className="block w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            defaultValue={values.city}
          />
        </div>
      </div>
    </>
  );
};

export default ShippingDetailForm;

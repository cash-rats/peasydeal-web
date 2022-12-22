/*
  TODOs
    - [ ] Email validation
    - [ ] Header
    - [ ] validation error should be displayed in tooltip.
*/
import { useEffect, useReducer } from 'react';
import type { ChangeEvent } from 'react';
import { json } from '@remix-run/node';
import type { LinksFunction, ActionFunction } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { TextField } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Tooltip from '@mui/material/Tooltip';
import useDebounce from 'react-debounced';
import MoonLoader from 'react-spinners/MoonLoader';

import TextDropdownField from '~/components/TextDropdownField';
import type { Option as DropdownOption } from '~/components/TextDropdownField';

import { fetchAddressOptionsByPostal, } from './api.server';
import type { Option } from './api.server';
import styles from './styles/ShippingDetailForm.css';
import { inistialState, addressOptionsReducer, AddressOptionsActionTypes } from './reducer';
import type { ShippingDetailFormType } from '../../types';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const formEntries = Object.fromEntries(form.entries());
  const postal = formEntries.postal as string;
  if (!postal) return null;
  try {
    const options = await fetchAddressOptionsByPostal({ postal });
    return json<Option[]>(options);
  } catch (err) {
    return json<Option[]>([]);
  }
}

interface ShippingDetailFormProps {
  values: ShippingDetailFormType;
  onSelectAddress?: (option: Option) => void;
}

// When user finish typing postal code, request remote API for address autocompletion.
// - [ ] display loading UI when fetching address options.
// - [ ] give default value when done loading address options.
const ShippingDetailForm = ({ values, onSelectAddress = () => { } }: ShippingDetailFormProps) => {
  const debounce = useDebounce(400);
  const loadAddrFetcher = useFetcher();
  const [state, dispatch] = useReducer(addressOptionsReducer, inistialState);

  useEffect(() => {
    if (loadAddrFetcher.type === 'done') {
      dispatch({
        type: AddressOptionsActionTypes.update_all_options,
        payload: loadAddrFetcher.data,
      });
    }
  }, [loadAddrFetcher.type]);

  const loadAddrOptions = (postal: string) => {
    loadAddrFetcher.submit(
      { postal },
      { method: 'post', action: 'checkout/components/ShippingDetailForm?index' }
    );
  };

  const handleChangePostal = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    const value = evt.target.value;
    if (!value) return;
    debounce(() => loadAddrOptions(value));
  };

  const handleSelectOption = (option: DropdownOption<Option>) => {
    onSelectAddress({ ...option.value });
  };

  return (
    <>
      <div className="shipping-form-fields field--1">
        <div>
          <TextDropdownField<Option>
            options={state.options}
            required
            id="postalcode"
            label="postal"
            name="postal"
            variant="outlined"
            aria-describedby="postalcode"
            fullWidth
            value={values.postal}
            onChange={handleChangePostal}
            onSelect={handleSelectOption}
            preventSelectChangeValue
            disabled={loadAddrFetcher.state !== 'idle'}
            InputProps={{
              endAdornment: (
                <>
                  {
                    loadAddrFetcher.state !== 'idle' && (
                      <MoonLoader size={20} cssOverride={{ color: '#009378' }} />
                    )
                  }

                  {
                    loadAddrFetcher.type === 'done' && state.options.length === 0 && (
                      <Tooltip title="no address suggestions">
                        <QuestionMarkIcon style={{
                          fontSize: '1.5rem',
                          color: '#009378',
                        }} />
                      </Tooltip>
                    )
                  }
                </>
              ),
            }}
          />

          <p className="flex items-center m-0 py-2 text-sm font-light gap-2">
            <span> <InfoIcon fontSize='small' color='success' /> </span>
            Auto lookup address by postal code
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="shipping-form-fields field--1">
        <TextField
          required
          type='email'
          id='email'
          label="email"
          name='email'
          placeholder='e.g. elonmusk@gmail.com'
          variant='outlined'
          aria-describedby='my-helper-text'
          fullWidth
          value={values.email}
        />
      </div>

      {/* Name */}
      <div className="shipping-form-fields fields--2">
        <TextField
          required
          id="firstname"
          label="firstname"
          name="firstname"
          variant="outlined"
          aria-describedby="firstname"
          fullWidth
          value={values.firstname}
        />

        <TextField
          required
          id="lastname"
          label="lastname"
          name="lastname"
          variant="outlined"
          aria-describedby="lastname"
          fullWidth
          value={values.lastname}
        />
      </div>

      {/* Address line */}
      <div className="shipping-form-fields field--1">
        <TextField
          autoComplete="off"
          required
          id="address1"
          label="address line 1"
          name="address1"
          variant="outlined"
          aria-describedby="address1"
          fullWidth
          value={values.address1}
        />
      </div>

      {/* Address line 2 (optional) */}
      <div className="shipping-form-fields field--1">
        <TextField
          autoComplete="off"
          id="address2"
          label="address line 2"
          name="address2"
          variant="outlined"
          aria-describedby="address2"
          fullWidth
          value={values.address2}
        />
      </div>

      {/* Postal code & City */}
      <div className="shipping-form-fields fields--1">
        {/* Might need a dropdown list for city selection for GB */}
        <TextField
          required
          autoComplete='off'
          id="city"
          label="city"
          name="city"
          variant="outlined"
          aria-describedby="city"
          fullWidth
          value={values.city}
        />
      </div>
    </>
  );
};

export default ShippingDetailForm;

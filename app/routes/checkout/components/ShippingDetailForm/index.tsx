/*
  TODOs
    - [ ] Email validation
    - [ ] Header
    - [ ] validation error should be displayed in tooltip.
*/
import { useEffect, useReducer } from 'react';
import type { ChangeEvent } from 'react';
import type { LinksFunction } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { TextField } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import type { ActionFunction } from '@remix-run/node';
import useDebounce from 'react-debounced';

import TextDropdownField from '~/components/TextDropdownField';

import styles from './styles/ShippingDetailForm.css';
import type { ShippingDetailFormType } from '../../types';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

export const action: ActionFunction = () => {
  console.log('debug trigger action');

  return null;
}

interface ShippingDetailFormProps {
  values: ShippingDetailFormType;
}

// When user finish typing postal code, request remote API for address autocompletion.
const ShippingDetailForm = ({ values }: ShippingDetailFormProps) => {
  const debounce = useDebounce(400);
  const loadAddrFetcher = useFetcher();

  useEffect(() => {
    if (loadAddrFetcher.type === 'done') {
      console.log('debug loadAddrFetcher done');
    }
  }, [loadAddrFetcher.type]);

  const loadAddrOptions = () => {
    console.log('debug askAddressOption');
    loadAddrFetcher.submit(null, { method: 'post', action: 'checkout/components/ShippingDetailForm?index' });
  };

  const handleChangePostal = (evt: ChangeEvent<HTMLTextAreaElement>) => debounce(loadAddrOptions);

  return (
    <>
      <div className="shipping-form-fields field--1">
        <div>
          <TextField
            required
            id="postalcode"
            label="postal"
            name="postal"
            variant="outlined"
            aria-describedby="postalcode"
            fullWidth
            value={values.postal}
            onChange={handleChangePostal}
          />

          <p className="flex items-center m-0 py-2 text-sm font-light gap-2">
            <span> <InfoIcon fontSize='small' color='success' /> </span>
            Address options will be generated after prompted postal code.
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
        <TextDropdownField
          options={
            new Array(9).fill(0).map((_, i) => ({
              label: `some address${i}`,
              value: `some address${i}`,
            }))
          }
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
        <TextDropdownField
          options={
            new Array(9).fill(0).map((_, i) => ({
              label: `some address${i}`,
              value: `some address${i}`,
            }))
          }
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
        <TextDropdownField
          options={
            new Array(9).fill(0).map((_, i) => ({
              label: `some address${i}`,
              value: `some address${i}`,
            }))
          }
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

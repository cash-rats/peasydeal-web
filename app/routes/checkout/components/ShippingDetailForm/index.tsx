/*
  TODOs
    - [ ] Email validation
    - [ ] Header
    - [ ] validation error should be displayed in tooltip.
*/
import type { LinksFunction } from '@remix-run/node';
import { TextField } from '@mui/material';

import styles from './styles/ShippingDetailForm.css';
import type { ShippingDetailFormType } from '../../types';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

interface ShippingDetailFormProps {
  values: ShippingDetailFormType;
}

const ShippingDetailForm = ({ values }: ShippingDetailFormProps) => {
  return (
    <>
      {/* Email */}
      <div className="shipping-form-fields field--1">
        <TextField
          required
          type='email'
          id="email"
          label="email"
          name="email"
          placeholder='e.g. elonmusk@gmail.com'
          variant="outlined"
          aria-describedby="my-helper-text"
          fullWidth
          value={values.email}
        />
      </div>


      {/* Name */}
      <div className="shipping-form-fields fields--2">
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
      </div>

      {/* Address line */}
      <div className="shipping-form-fields field--1">
        <TextField
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
      <div className="shipping-form-fields fields--2">
        <TextField
          required
          id="postalcode"
          label="postal"
          name="postal"
          variant="outlined"
          aria-describedby="postalcode"
          fullWidth
          value={values.postal}
        />

        {/* Might need a dropdown list for city selection for GB */}
        <TextField
          required
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

import type { LinksFunction } from '@remix-run/node';
import FormControl from '@mui/material/FormControl';
import {
  TextField,
} from '@mui/material';

import styles from './styles/ShippingDetailForm.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

function ShippingDetailForm() {
  return (
    <FormControl fullWidth>
      {/* Email */}
      <div className="shipping-form-fields field--1">
        <TextField
          required
          id="email"
          label="email"
          placeholder='e.g. elonmusk@gmail.com'
          variant="outlined"
          aria-describedby="my-helper-text"
          fullWidth
        />
      </div>

      {/* Name */}
      <div className="shipping-form-fields fields--2">
        <TextField
          required
          id="lastname"
          label="lastname"
          variant="outlined"
          aria-describedby="lastname"
          fullWidth
        />

        <TextField
          required
          id="firstname"
          label="firstname"
          variant="outlined"
          aria-describedby="firstname"
          fullWidth
        />
      </div>

      {/* Address line */}
      <div className="shipping-form-fields field--1">
        <TextField
          required
          id="address1"
          label="address line 1"
          variant="outlined"
          aria-describedby="address1"
          fullWidth
        />
      </div>

      {/* Address line 2 (optional) */}
      <div className="shipping-form-fields field--1">
        <TextField
          id="address2"
          label="address line 2"
          variant="outlined"
          aria-describedby="address2"
          fullWidth
        />
      </div>

      {/* Postal code & City */}
      <div className="shipping-form-fields fields--2">
        <TextField
          required
          id="postalcode"
          label="postal"
          variant="outlined"
          aria-describedby="postalcode"
          fullWidth
        />

        {/* Might need a dropdown list for city selection for GB */}
        <TextField
          required
          id="city"
          label="city"
          variant="outlined"
          aria-describedby="postalcode"
          fullWidth
        />
      </div>
    </FormControl>
  );
};

export default ShippingDetailForm;
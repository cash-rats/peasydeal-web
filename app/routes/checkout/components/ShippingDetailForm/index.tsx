import { forwardRef } from 'react';
import type { LinksFunction } from '@remix-run/node';
import FormControl from '@mui/material/FormControl';
import { TextField } from '@mui/material';
import { Formik } from 'formik';

import styles from './styles/ShippingDetailForm.css';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }];
};

const validate = values => {
  const errors = {};
  if (!values.email) {
    errors.email = 'required';
  }

  if (!values.lastname) {
    errors.lastname = 'required';
  }

  if (!values.firstname) {
    errors.firstname = 'required';
  }

  if (!values.address1) {
    errors.address1 = 'required';
  }

  if (!values.postal) {
    errors.postal = 'required';
  }

  if (!values.city) {
    errors.city = 'required';
  }

  return errors;
};


const ShippingDetailForm = forwardRef((props, ref) => {
  const initialValues = {
    email: '',
    lastname: '',
    firstname: '',
    address1: '',
    address2: '',
    postal: '',
    city: '',
  }

  return (
    <FormControl fullWidth>
      <Formik
        innerRef={ref}
        initialValues={initialValues}
        validate={validate}
        id="shipping-detail-form"
      >
        {
          ({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
          }) => {
            return (
              <>
                {/* Email */}
                <div className="shipping-form-fields field--1">
                  <TextField
                    required
                    id="email"
                    label="email"
                    name="email"
                    placeholder='e.g. elonmusk@gmail.com'
                    variant="outlined"
                    aria-describedby="my-helper-text"
                    fullWidth
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.email && errors.email}
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.lastname && errors.lastname}
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.firstname && errors.firstname}
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.address1 && errors.address1}
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
                    onChange={handleChange}
                    helperText={touched.address2 && errors.address2}
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.postal && errors.postal}
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.city && errors.city}
                  />
                </div>
              </>
            );
          }
        }
      </Formik>
    </FormControl>
  );
});

export default ShippingDetailForm;

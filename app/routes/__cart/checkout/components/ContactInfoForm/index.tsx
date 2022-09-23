import { forwardRef, useState } from 'react';
import { Formik } from 'formik';
import type { LinksFunction } from '@remix-run/node';
import PhoneInput from 'react-phone-input-2'
import type { CountryData } from 'react-phone-input-2';
import reactPhoneInput2Styles from 'react-phone-input-2/lib/material.css';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

import HelpIcon from '@mui/icons-material/Help';

import styles from './styles/ContactInfoForm.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
    { rel: 'stylesheet', href: reactPhoneInput2Styles },
  ];
};

const validate = (values) => {
  const errors = {}

  if (!values.contact_name_same && !values.contact_name) {
    errors.contact_name = 'contact name required';
  }

  if (!values.phone) {
    errors.phone = 'required';
  }

  return errors;
}

interface ContactInfoInitValues {
  phone: string;
  country_data: {} | CountryData;
  phone_value: string;
  contact_name_same: boolean;
  contact_name: string;
}

const ContactInfoForm = forwardRef((props, ref) => {
  const [contactNameSame, setContactNameSame] = useState(true);

  const initialValues: ContactInfoInitValues = {
    phone: '',
    country_data: {},
    phone_value: '',
    contact_name_same: true,
    contact_name: '',
  };


  return (
    <Formik
      innerRef={ref}
      initialValues={initialValues}
      validate={validate}
      id="contact-info-form"
    >
      {
        ({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
        }) => {
          console.log('errors 1', errors);
          console.log('errors 2', touched);
          return (
            <>
              <div className="contact-name-the-same">
                <Checkbox
                  aria-label='is contact name the same as shipping name?'
                  name='contact_name_same'
                  id='contact_name_same'
                  onChange={(evt) => {
                    setContactNameSame(evt.target.checked);
                    handleChange(evt);
                  }}
                  onBlur={handleBlur}
                  checked={values.contact_name_same}
                />

                <p> Contact name the same as above </p>
              </div>

              {
                !contactNameSame && (
                  <div className="contact-name">
                    <TextField
                      id="contact_name"
                      label="contact name"
                      name="contact_name"
                      placeholder='e.g. jack dorsey'
                      variant="outlined"
                      aria-describedby="shipping contact name"
                      fullWidth
                      value={values.contact_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      helperText={touched.contact_name && errors.contact_name}
                    />
                  </div>
                )
              }

              <PhoneInput
                country='gb'
                inputProps={{
                  id: 'phone',
                  name: 'phone',
                  label: 'phone',
                }}
                inputStyle={{ width: '100%' }}
                value={values.phone}
                onChange={(v, countryData, evt) => {
                  values.country_data = countryData;
                  values.phone_value = v;

                  handleChange(evt)
                }}
                onBlur={handleBlur}
              />
              {
                touched.phone && errors.phone && (
                  <p className='phone-error-message'>
                    {errors.phone}
                  </p>
                )
              }

              <div>
                <p className="promise">
                  <span>
                    <HelpIcon fontSize='small' color='success' />
                  </span>
                  Phone number is for shipping purpose only.
                </p>
              </div>
            </>
          )
        }
      }
    </Formik>
  );
});

export default ContactInfoForm;
import { useState } from 'react';
import type { LinksFunction } from '@remix-run/node';
import PhoneInput from 'react-phone-input-2'
import type { CountryData } from 'react-phone-input-2';
import reactPhoneInput2Styles from 'react-phone-input-2/lib/material.css';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import HelpIcon from '@mui/icons-material/Help';

import styles from './styles/ContactInfoForm.css';
import type { ContactInfoFormType } from '../../types';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
    { rel: 'stylesheet', href: reactPhoneInput2Styles },
  ];
};

interface ContactInfoFormProps {
  values: ContactInfoFormType;
  onChange?: (v: ContactInfoFormType) => void;
}

const ContactInfoForm = ({ values, onChange = () => { } }: ContactInfoFormProps) => {
  const [formValues, setFormValues] = useState<ContactInfoFormType>(values);

  const handleChange = (evt) => {
    const fieldName = evt.target.name;
    let fieldValue = evt.target.value;

    if (evt.target.type === 'checkbox') {
      fieldValue = evt.target.checked;
    }

    const newFormValues = {
      ...formValues,
      [fieldName]: fieldValue,
    }

    setFormValues(newFormValues);
    onChange(newFormValues);
  }
  const handleChangePhone = (v: string, countryData: CountryData | {}, evt) => {
    if (evt.target.setCustomValidity) {
      evt.target.setCustomValidity('');
    }

    const newFormValues: ContactInfoFormType = {
      ...formValues,
      country_data: countryData,
      phone_value: v,
    };

    setFormValues(newFormValues);
    onChange(newFormValues);
  }

  return (
    <>
      <div className="contact-name-the-same">
        <Checkbox
          aria-label='is contact name the same as shipping name?'
          name='contact_name_same'
          id='contact_name_same'
          checked={formValues.contact_name_same}
          onChange={handleChange}
        />

        <p> Contact name the same as above </p>
      </div>

      {
        !values.contact_name_same && (
          <div className="contact-name">
            <TextField
              required
              id="contact_name"
              label="contact name"
              name="contact_name"
              placeholder='e.g. jack dorsey'
              variant="outlined"
              aria-describedby="shipping contact name"
              fullWidth
              value={formValues.contact_name}
              onChange={handleChange}
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
          required: true,
        }}
        inputStyle={{ width: '100%' }}
        value={formValues.phone}
        onChange={handleChangePhone}
      />

      <div>
        <p className="promise">
          <span>
            <HelpIcon fontSize='small' color='success' />
          </span>
          Phone number is for shipping purpose only.
        </p>
      </div>
    </>

  );
};

export default ContactInfoForm;
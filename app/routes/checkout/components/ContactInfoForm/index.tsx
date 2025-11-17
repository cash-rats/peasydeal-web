import { useState } from 'react';
import type { LinksFunction } from 'react-router';
import PhoneInput from 'react-phone-input-2';
import type { CountryData } from 'react-phone-input-2';
import reactPhoneInput2Styles from 'react-phone-input-2/lib/material.css?url';
import { FiHelpCircle } from 'react-icons/fi';

import { Checkbox } from '~/components/ui/checkbox';
import { Input } from '~/components/ui/input';

import styles from './styles/ContactInfoForm.css?url';
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
          aria-label="is contact name the same as shipping name?"
          name="contact_name_same"
          id="contact_name_same"
          checked={formValues.contact_name_same}
          onChange={handleChange}
        />

        <p> Contact name the same as above </p>
      </div>

      {
        !values.contact_name_same && (
          <div className="contact-name">
            <label
              htmlFor="contact_name"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              contact name
            </label>
            <Input
              required
              id="contact_name"
              name="contact_name"
              placeholder="e.g. jack dorsey"
              aria-describedby="shipping contact name"
              value={formValues.contact_name}
              onChange={handleChange}
            />
          </div>
        )
      }

      <div className="mb-4">
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          email
        </label>
        <Input
          required
          type="email"
          id="email"
          name="email"
          placeholder="e.g. elonmusk@gmail.com"
          aria-describedby="my-helper-text"
          value={formValues.email}
          onChange={handleChange}
        />
      </div>

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
            <FiHelpCircle className="h-4 w-4 text-emerald-500" />
          </span>
          Phone number is for shipping purpose only.
        </p>
      </div>
    </>

  );
};

export default ContactInfoForm;

import type { ChangeEvent, MouseEvent } from 'react';
import { useState } from 'react';
import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

export type Option = {
  value: string;
  label: string;
};

type TextDropdownFieldProps = {
  defaultValue?: string;
  options?: Option[],

  onChange?: (v: ChangeEvent<HTMLInputElement>) => void;
  onSelect?: (v: string) => void;
} & TextFieldProps;

// - [ ] enable dropdown when onfocus and options is not empty.
export default function TextDropdownField({
  options = [],
  defaultValue = '',
  onChange = () => { },
  onSelect = () => { },
  ...props
}: TextDropdownFieldProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);

  const handleFocus = () => {
    if (options.length === 0) return;
    setOpen(true);
  };
  const handleBlur = () => {
    setOpen(false);
  }
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setOpen(false);
    setValue(evt.target.value);
    onChange(evt);
  }
  const handleSelect = (evt: MouseEvent<HTMLLIElement>, option: Option) => {
    setValue(option.value);
  }

  return (
    <div className="relative">
      <TextField
        {...props}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
      />

      {
        open && (
          <ul className="
        border-solid border py-1 m-0 border-gray-300 rounded-sm
        flex flex-col items-center justify-center shadow-dropdown
        absolute w-full bg-white z-1
      "
          >
            {
              options.map((option, index) => {
                return (
                  <li className="
                cursor-pointer h-full w-full py-2
                text-center box-border
                hover:bg-gray-hover-bg-2
                "
                    key={index}
                    onMouseUp={(evt) => {
                      console.log('trigger onMouseUp');
                    }}
                    onMouseDown={(evt) => {
                      handleSelect(evt, option);
                    }}
                  >
                    {option.label}
                  </li>
                )
              })
            }
          </ul>
        )
      }
    </div>
  );
}
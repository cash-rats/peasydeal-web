import type { ChangeEvent, MouseEvent } from 'react';
import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

export type Option = {
  value: string;
  label: string;
};

type TextDropdownFieldProps = {
  defaultOption?: Option | null;
  options?: Option[],

  onChange?: (v: ChangeEvent<HTMLInputElement>) => void;
  onSelect?: (v: Option) => void;
} & TextFieldProps;

// - [ ] enable dropdown when onfocus and options is not empty.
export default function TextDropdownField({
  options = [],
  defaultOption = null,
  onChange = () => { },
  onSelect = () => { },
  ...props
}: TextDropdownFieldProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultOption?.label || '');

  useEffect(() => {
    if (!defaultOption) return;
    setValue(defaultOption.label);
  }, [defaultOption]);

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
    if (!option) return;
    setValue(option.label);
    onSelect(option);
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
          border-solid border py-1 m-0
          border-gray-300 rounded-sm
          flex flex-col items-center justify-center
          shadow-dropdown absolute w-full bg-white z-10
          overflow-hidden max-h-[220px] overflow-y-auto
          "
          >
            {
              options.map((option, index) => {
                return (
                  <li className="
                cursor-pointer h-full w-full py-2 px-2
                box-border bg-white text-base
                font-normal hover:bg-gray-hover-bg-2
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
import type { ChangeEvent, MouseEvent, ReactNode, InputHTMLAttributes } from 'react';
import { useState, useEffect, useRef } from 'react';

import { Input } from '~/components/ui/input';
import { cn } from '~/lib/utils';

export type Option<T> = {
  value: T;
  label: string;
};

type TextDropdownFieldProps<T> = {
  defaultOption?: Option<T> | null;
  options?: Option<T>[],
  preventSelectChangeValue?: boolean,
  label?: string;
  endAdornment?: ReactNode;
  inputClassName?: string;
  value?: string;

  onChange?: (v: ChangeEvent<HTMLInputElement>) => void;
  onSelect?: (v: Option<T>) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'defaultValue'>;

// - [ ] enable dropdown when onfocus and options is not empty.
export default function TextDropdownField<T>({
  options = [],
  defaultOption = null,
  preventSelectChangeValue = false,
  label,
  endAdornment,
  inputClassName,
  value: externalValue,
  onChange = () => { },
  onSelect = () => { },
  ...props
}: TextDropdownFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultOption?.label || '');
  const fieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!defaultOption) return;
    setValue(defaultOption.label);
  }, [defaultOption]);

  useEffect(() => {
    if (externalValue === undefined) return;
    setValue(externalValue);
  }, [externalValue]);

  useEffect(() => {
    if (options.length <= 0) return;
    setOpen(true);

    if (!fieldRef.current) return;
    fieldRef.current.focus();
  }, [options])

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
  const handleSelect = (evt: MouseEvent<HTMLLIElement>, option: Option<T>) => {
    if (!option) return;
    if (!preventSelectChangeValue) {
      setValue(option.label);
    }
    onSelect(option);
  }

  return (
    <div className="relative">
      {label && (
        <label
          htmlFor={props.id}
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          {...props}
          ref={fieldRef}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className={cn('pr-10', inputClassName, props.className)}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {endAdornment}
          </div>
        )}
      </div>

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

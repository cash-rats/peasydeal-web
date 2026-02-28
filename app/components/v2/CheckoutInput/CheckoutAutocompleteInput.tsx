import { useEffect, useId, useRef, useState } from 'react';

import { cn } from '~/lib/utils';

export type CheckoutAutocompleteOption<T> = {
  value: T;
  label: string;
};

export interface CheckoutAutocompleteInputProps<T> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (option: CheckoutAutocompleteOption<T>) => void;
  options: CheckoutAutocompleteOption<T>[];
  loading?: boolean;
  error?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
}

function ErrorIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1" />
      <path d="M6 3.5V6.5M6 8V8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className="h-4 w-4 animate-spin text-[#666]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckoutAutocompleteInput<T>({
  label,
  value,
  onChange,
  onSelect,
  options,
  loading = false,
  error,
  className,
  disabled,
  id,
  name,
  required,
}: CheckoutAutocompleteInputProps<T>) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [focused, setFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenuTimerRef = useRef<number | null>(null);

  const hasValue = value.length > 0;
  const floated = focused || hasValue;

  useEffect(() => {
    if (focused && options.length > 0) {
      setMenuOpen(true);
      return;
    }
    setMenuOpen(false);
  }, [focused, options.length]);

  useEffect(() => {
    return () => {
      if (closeMenuTimerRef.current) {
        window.clearTimeout(closeMenuTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={cn('relative', className)}>
      <input
        id={inputId}
        name={name}
        type="text"
        value={value}
        required={required}
        disabled={disabled}
        onChange={(evt) => onChange(evt.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          closeMenuTimerRef.current = window.setTimeout(() => {
            setMenuOpen(false);
          }, 100);
        }}
        className={cn(
          'w-full h-12 border rounded-md font-body text-sm font-normal text-black bg-white outline-none pr-10',
          'transition-all duration-fast',
          floated ? 'pt-5 pb-1 px-3.5' : 'px-3.5',
          error
            ? 'border-[#C75050] shadow-[0_0_0_1px_#C75050]'
            : focused
            ? 'border-black shadow-[0_0_0_1px_#000]'
            : 'border-[#CCC]',
        )}
      />

      <label
        htmlFor={inputId}
        className={cn(
          'absolute left-3.5 pointer-events-none font-body font-normal transition-all duration-fast',
          floated
            ? 'top-2 text-[11px]'
            : 'top-1/2 -translate-y-1/2 text-sm',
          error ? 'text-[#C75050]' : 'text-[#999]',
        )}
      >
        <span>{label}</span>
        {required ? (
          <span className="ml-0.5 text-[#C75050]" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#999]">
        {loading ? <SpinnerIcon /> : <ChevronIcon />}
      </div>

      {menuOpen && options.length > 0 ? (
        <ul
          role="listbox"
          className={cn(
            'absolute z-20 mt-2 max-h-[240px] w-full overflow-y-auto rounded-md border border-[#E0E0E0] bg-white shadow-overlay',
          )}
        >
          {options.map((option, index) => (
            <li
              role="option"
              aria-selected={false}
              key={`${option.label}-${index}`}
              className="cursor-pointer px-3.5 py-2.5 font-body text-sm text-black transition-colors duration-fast hover:bg-[#F9F9F9]"
              onMouseDown={(evt) => {
                evt.preventDefault();
                onSelect(option);
                setMenuOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      ) : null}

      {error ? (
        <p className="mt-1 flex items-center gap-1 font-body text-xs font-normal text-[#C75050]">
          <ErrorIcon />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default CheckoutAutocompleteInput;

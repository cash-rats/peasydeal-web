import { useState, useId } from "react";
import type { ReactNode } from 'react';
import { cn } from "~/lib/utils";

export interface CheckoutInputProps {
  id?: string;
  name?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "number";
  error?: string;
  optional?: boolean;
  required?: boolean;
  labelIcon?: ReactNode;
  className?: string;
}

export interface CheckoutSelectProps {
  id?: string;
  name?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  required?: boolean;
  error?: string;
  className?: string;
}

function ErrorIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1" />
      <path d="M6 3.5V6.5M6 8V8.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function CheckoutInput({
  id,
  name,
  label,
  value,
  onChange,
  type = "text",
  error,
  optional,
  required = false,
  labelIcon,
  className,
}: CheckoutInputProps) {
  const [focused, setFocused] = useState(false);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasValue = value.length > 0;
  const floated = focused || hasValue;

  return (
    <div className={cn("relative", className)}>
      <input
        id={inputId}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(e) => {
          e.currentTarget.setCustomValidity('');
          onChange(e.target.value);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          "w-full h-12 border rounded-md font-body text-sm font-normal text-black bg-white outline-none",
          "transition-all duration-fast",
          floated ? "pt-5 pb-1 px-3.5" : "px-3.5",
          error
            ? "border-[#C75050] shadow-[0_0_0_1px_#C75050]"
            : focused
            ? "border-black shadow-[0_0_0_1px_#000]"
            : "border-[#CCC]"
        )}
      />
      <label
        htmlFor={inputId}
        className={cn(
          "absolute left-3.5 font-body font-normal transition-all duration-fast",
          floated
            ? "top-2 text-[11px]"
            : "top-1/2 -translate-y-1/2 text-sm",
          error ? "text-[#C75050]" : "text-[#999]"
        )}
      >
        <span className="inline-flex items-center">
          <span>{label}</span>
          {required && !optional && (
            <span className="ml-0.5 text-[#C75050]" aria-hidden="true">
              *
            </span>
          )}
          {labelIcon && <span className="ml-1.5 inline-flex items-center">{labelIcon}</span>}
        </span>
        {optional && (
          <span className="font-normal text-[#999]"> (optional)</span>
        )}
      </label>
      {error && (
        <p className="flex items-center gap-1 mt-1 font-body text-xs font-normal text-[#C75050]">
          <ErrorIcon />
          {error}
        </p>
      )}
    </div>
  );
}

export function CheckoutSelect({
  id,
  name,
  label,
  value,
  onChange,
  options,
  required = false,
  error,
  className,
}: CheckoutSelectProps) {
  const [focused, setFocused] = useState(false);
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const hasValue = value.length > 0;
  const floated = focused || hasValue;

  return (
    <div className={cn("relative", className)}>
      <select
        id={selectId}
        name={name}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          "w-full h-12 border rounded-md font-body text-sm font-normal text-black bg-white outline-none appearance-none",
          "transition-all duration-fast",
          floated ? "pt-5 pb-1 px-3.5" : "px-3.5",
          error
            ? "border-[#C75050] shadow-[0_0_0_1px_#C75050]"
            : focused
            ? "border-black shadow-[0_0_0_1px_#000]"
            : "border-[#CCC]"
        )}
      >
        <option value="" disabled hidden />
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <label
        htmlFor={selectId}
        className={cn(
          "absolute left-3.5 pointer-events-none font-body font-normal transition-all duration-fast",
          floated
            ? "top-2 text-[11px]"
            : "top-1/2 -translate-y-1/2 text-sm",
          error ? "text-[#C75050]" : "text-[#999]"
        )}
      >
        <span>{label}</span>
        {required && (
          <span className="ml-0.5 text-[#C75050]" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {/* Custom chevron */}
      <svg
        width="10"
        height="6"
        viewBox="0 0 10 6"
        fill="none"
        className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#999]"
      >
        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {error && (
        <p className="flex items-center gap-1 mt-1 font-body text-xs font-normal text-[#C75050]">
          <ErrorIcon />
          {error}
        </p>
      )}
    </div>
  );
}

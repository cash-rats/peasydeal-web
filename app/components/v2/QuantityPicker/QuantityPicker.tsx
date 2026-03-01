import { cn } from "~/lib/utils";
import { useEffect, useState } from "react";

export interface QuantityPickerProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "default" | "compact" | "pill";
  className?: string;
}

const containerStyles: Record<string, string> = {
  default: "flex items-center border-[1.5px] border-[#E0E0E0] rounded-rd-sm overflow-hidden h-12",
  compact: "inline-flex items-center border border-[#E0E0E0] rounded-rd-full h-8",
  pill: "flex items-center border border-[#E0E0E0] rounded-rd-full h-10 overflow-hidden",
};

const buttonStyles: Record<string, string> = {
  default: "w-10 h-full text-[18px]",
  compact: "w-8 h-full text-[14px]",
  pill: "w-9 h-full text-[16px] hover:bg-[#F5F5F5]",
};

const inputStyles: Record<string, string> = {
  default: "w-10 text-center text-[14px] font-medium",
  compact: "w-7 text-center text-[13px]",
  pill: "w-7 text-center text-[13px] font-medium",
};

function MinusIcon() {
  return (
    <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M1 1H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function QuantityPicker({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "default",
  className,
}: QuantityPickerProps) {
  const [inputValue, setInputValue] = useState(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const isAtMin = value <= min;
  const isAtMax = value >= max;

  const handleDecrement = () => {
    if (!isAtMin) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (!isAtMax) onChange(value + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setInputValue(raw);
    if (raw === "") return;

    const num = parseInt(raw, 10);
    if (num >= min && num <= max) {
      onChange(num);
    }
  };

  const handleInputBlur = () => {
    if (inputValue === "") {
      setInputValue(String(value));
      return;
    }

    const num = parseInt(inputValue, 10);
    if (Number.isNaN(num)) {
      setInputValue(String(value));
      return;
    }

    const clamped = Math.max(min, Math.min(num, max));
    if (clamped !== value) {
      onChange(clamped);
    } else {
      setInputValue(String(clamped));
    }
  };

  return (
    <div className={cn(containerStyles[size], className)}>
      <button
        type="button"
        className={cn(
          buttonStyles[size],
          "bg-transparent border-none cursor-pointer",
          "flex items-center justify-center",
          "text-black transition-colors duration-fast",
          isAtMin && "text-[#CCCCCC] cursor-default"
        )}
        onClick={handleDecrement}
        disabled={isAtMin}
        aria-label="Decrease quantity"
      >
        <MinusIcon />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={(e) => e.currentTarget.select()}
        className={cn(
          inputStyles[size],
          "border-none bg-transparent text-black font-body",
          "outline-none",
          "[appearance:textfield]",
          "[&::-webkit-outer-spin-button]:appearance-none",
          "[&::-webkit-inner-spin-button]:appearance-none"
        )}
        aria-label="Quantity"
      />
      <button
        type="button"
        className={cn(
          buttonStyles[size],
          "bg-transparent border-none cursor-pointer",
          "flex items-center justify-center",
          "text-black transition-colors duration-fast",
          isAtMax && "text-[#CCCCCC] cursor-default"
        )}
        onClick={handleIncrement}
        disabled={isAtMax}
        aria-label="Increase quantity"
      >
        <PlusIcon />
      </button>
    </div>
  );
}

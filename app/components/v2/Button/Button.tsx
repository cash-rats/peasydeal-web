import React from "react";
import { cn } from "~/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "pill";
  inverted?: boolean;
  size?: "default" | "sm" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<string, string> = {
  primary: [
    "bg-black text-white border-none rounded-rd-sm",
    "hover:bg-[#333333] active:bg-[#1A1A1A]",
    "disabled:bg-[#CCCCCC] disabled:cursor-default",
  ].join(" "),
  secondary: [
    "bg-white text-black border-[1.5px] border-[#E0E0E0] rounded-rd-sm",
    "hover:bg-[#F5F5F5] hover:border-[#CCCCCC] active:bg-[#EEEEEE]",
  ].join(" "),
  pill: [
    "bg-black text-white border-none rounded-rd-full",
    "hover:bg-[#333333]",
  ].join(" "),
  "pill-inverted": [
    "bg-white text-black border-none rounded-rd-full",
    "hover:bg-[#F0F0F0]",
  ].join(" "),
};

const sizeStyles: Record<string, Record<string, string>> = {
  primary: {
    sm: "h-9 px-5 text-[13px]",
    default: "h-12 px-8 text-[14px]",
    lg: "h-[52px] px-10 text-[15px]",
  },
  secondary: {
    sm: "h-9 px-5 text-[13px]",
    default: "h-12 px-8 text-[14px]",
    lg: "h-[52px] px-10 text-[15px]",
  },
  pill: {
    sm: "px-5 py-2 text-[12px]",
    default: "px-7 py-3 text-[13px]",
    lg: "px-9 py-[14px] text-[14px]",
  },
};

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
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
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      inverted = false,
      size = "default",
      isLoading = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const resolvedVariant =
      variant === "pill" && inverted ? "pill-inverted" : variant;
    const baseVariant = variant === "pill" ? "pill" : variant;

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center",
          "font-body font-semibold",
          "cursor-pointer",
          "transition-all duration-fast",
          "disabled:cursor-default",
          variantStyles[resolvedVariant],
          sizeStyles[baseVariant]?.[size],
          isLoading && "pointer-events-none",
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <Spinner /> : children}
      </button>
    );
  }
);

Button.displayName = "Button";

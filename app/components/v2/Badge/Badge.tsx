import { cn } from "~/lib/utils";

export interface BadgeProps {
  variant: "discount" | "new" | "selling-fast" | "hot" | "limited" | "super-deal";
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeProps["variant"], string> = {
  discount: "bg-[#4A7C59]",
  new: "bg-[#C75050]",
  "selling-fast": "bg-[#4A7C59]",
  hot: "bg-[#E8A040]",
  limited: "bg-[#333333]",
  "super-deal": "bg-[#C75050]",
};

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        "px-[10px] py-1",
        "rounded-rd-full",
        "font-body text-[11px] font-semibold leading-none",
        "text-white whitespace-nowrap",
        "shadow-badge",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

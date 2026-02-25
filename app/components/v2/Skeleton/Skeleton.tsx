import { cn } from "~/lib/utils";

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: "sm" | "md" | "lg" | "full";
  className?: string;
}

const roundedStyles: Record<NonNullable<SkeletonProps["rounded"]>, string> = {
  sm: "rounded-rd-sm",
  md: "rounded-rd-md",
  lg: "rounded-rd-lg",
  full: "rounded-rd-full",
};

export function Skeleton({
  width = "100%",
  height = "16px",
  rounded = "sm",
  className,
}: SkeletonProps) {
  return (
    <div
      className={cn("skeleton", roundedStyles[rounded], className)}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
      aria-hidden="true"
    />
  );
}

/** Pre-composed skeleton for blog post cards (§9.2) */
export function BlogCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-rd-md overflow-hidden border border-[#F0F0F0]",
        className
      )}
    >
      <Skeleton
        width="100%"
        height="0"
        className="!h-0 pb-[62.5%]"
        rounded="sm"
      />
      <div className="p-5 space-y-3">
        <div className="flex gap-1.5">
          <Skeleton width={60} height={20} rounded="full" />
          <Skeleton width={48} height={20} rounded="full" />
        </div>
        <Skeleton width="80%" height={20} />
        <Skeleton width="100%" height={14} />
        <Skeleton width="65%" height={14} />
        <Skeleton width={90} height={12} />
      </div>
    </div>
  );
}

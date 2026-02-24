import { cn } from "~/lib/utils";

export interface TrustBadge {
  icon?: React.ReactNode;
  label: string;
}

export interface TrustBadgesRowProps {
  badges: TrustBadge[];
  className?: string;
}

function DefaultCheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="9" fill="currentColor" />
      <path
        d="M5.5 9.5L7.5 11.5L12.5 6.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrustBadgesRow({ badges, className }: TrustBadgesRowProps) {
  return (
    <section
      className={cn(
        "w-full px-12 py-10",
        "max-redesign-sm:px-4 max-redesign-sm:py-8",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-3",
          "max-redesign-sm:gap-2"
        )}
      >
        {badges.map((badge, index) => (
          <span
            key={index}
            className={cn(
              "inline-flex items-center gap-2 whitespace-nowrap",
              "rounded-full border border-[#E0E0E0] bg-white px-5 py-2.5"
            )}
          >
            <span className="h-[18px] w-[18px] shrink-0 text-[#888]">
              {badge.icon ?? <DefaultCheckIcon />}
            </span>
            <span className="font-body text-[13px] font-medium text-black">
              {badge.label}
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}

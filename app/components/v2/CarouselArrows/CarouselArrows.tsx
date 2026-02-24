import { cn } from "~/lib/utils";

export interface CarouselArrowsProps {
  onPrev: () => void;
  onNext: () => void;
  canPrev?: boolean;
  canNext?: boolean;
  className?: string;
}

function ChevronLeft() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 3L5 7L9 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5 3L9 7L5 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const buttonBase = [
  "w-9 h-9 rounded-full",
  "border border-[#E0E0E0] bg-white",
  "flex items-center justify-center",
  "text-black cursor-pointer",
  "transition-all duration-fast",
  "hover:bg-[#F5F5F5] hover:border-[#CCCCCC]",
  "disabled:opacity-30 disabled:cursor-default disabled:hover:bg-white disabled:hover:border-[#E0E0E0]",
].join(" ");

export function CarouselArrows({
  onPrev,
  onNext,
  canPrev = true,
  canNext = true,
  className,
}: CarouselArrowsProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      <button
        type="button"
        className={buttonBase}
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Previous"
      >
        <ChevronLeft />
      </button>
      <button
        type="button"
        className={buttonBase}
        onClick={onNext}
        disabled={!canNext}
        aria-label="Next"
      >
        <ChevronRight />
      </button>
    </div>
  );
}

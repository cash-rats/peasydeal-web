import { cn } from "~/lib/utils";
import { Button } from "~/components/v2/Button/Button";

function EmptyBoxIcon() {
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      fill="none"
      className="mx-auto mb-6 opacity-40"
      aria-hidden="true"
    >
      <rect x="25" y="45" width="90" height="70" rx="6" stroke="#000" strokeWidth="1.5" />
      <path d="M25 65H115" stroke="#000" strokeWidth="1.5" />
      <path d="M55 25L70 45L85 25" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50 80H90" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3" />
    </svg>
  );
}

export interface TrackingErrorProps {
  onRetry?: () => void;
  message?: string;
  className?: string;
}

export function TrackingError({
  onRetry,
  message = "We couldn't find an order with that ID. Please double-check and try again.",
  className,
}: TrackingErrorProps) {
  return (
    <div
      className={cn(
        "max-w-[var(--container-max)] mx-auto px-[var(--container-padding)]",
        "py-20 text-center",
        className
      )}
    >
      <EmptyBoxIcon />
      <h2 className="font-heading text-2xl font-bold text-black mb-2">
        Order not found
      </h2>
      <p className="font-body text-[15px] text-rd-text-body max-w-[440px] mx-auto leading-relaxed mb-8">
        {message}
      </p>
      <p className="font-body text-sm text-rd-text-secondary mb-6">
        Need help?{" "}
        <a
          href="mailto:support@peasydeal.co.uk"
          className="text-black underline"
        >
          Contact us
        </a>
      </p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

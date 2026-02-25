import { cn } from "~/lib/utils";
import { Spinner } from "~/components/v2/Spinner";

export interface LoadingOverlayProps {
  message?: string;
  className?: string;
}

export function LoadingOverlay({ message, className }: LoadingOverlayProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[1200]",
        "bg-white/90 backdrop-blur-[4px]",
        "flex flex-col items-center justify-center",
        "animate-[fade-in_200ms_ease]",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Spinner size="xl" className="text-black" />
      {message && (
        <p className="font-body text-[15px] text-rd-text-secondary mt-4">
          {message}
        </p>
      )}
    </div>
  );
}

import React, { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastData {
  id: string;
  variant: ToastVariant;
  title?: string;
  message: string;
  duration?: number; // 0 = persistent
}

export interface ToastItemProps {
  toast: ToastData;
  onClose: (id: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Icons (inline SVG)                                                 */
/* ------------------------------------------------------------------ */

function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 10.5L8.5 12.5L13.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 7L13 13M13 7L7 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function InfoCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 9V14M10 6.5V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TriangleExclamationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 2L18.66 17H1.34L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 8V12M10 14.5V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Variant config                                                     */
/* ------------------------------------------------------------------ */

const variantConfig: Record<
  ToastVariant,
  { icon: React.ReactNode; color: string; border: string; defaultDuration: number }
> = {
  success: {
    icon: <CheckCircleIcon />,
    color: "text-[#4A7C59]",
    border: "border-l-[3px] border-l-[#4A7C59]",
    defaultDuration: 4000,
  },
  error: {
    icon: <XCircleIcon />,
    color: "text-[#C75050]",
    border: "border-l-[3px] border-l-[#C75050]",
    defaultDuration: 6000,
  },
  info: {
    icon: <InfoCircleIcon />,
    color: "text-black",
    border: "border-l-[3px] border-l-black",
    defaultDuration: 4000,
  },
  warning: {
    icon: <TriangleExclamationIcon />,
    color: "text-[#E8A040]",
    border: "border-l-[3px] border-l-[#E8A040]",
    defaultDuration: 6000,
  },
};

/* ------------------------------------------------------------------ */
/*  Toast item                                                         */
/* ------------------------------------------------------------------ */

function ToastItem({ toast, onClose }: ToastItemProps) {
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);
  const config = variantConfig[toast.variant];
  const duration = toast.duration ?? config.defaultDuration;

  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onClose(toast.id), 200);
  }, [onClose, toast.id]);

  useEffect(() => {
    if (duration === 0) return;
    timerRef.current = setTimeout(dismiss, duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [duration, dismiss]);

  const handleMouseEnter = () => {
    if (duration === 0) return;
    pausedRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleMouseLeave = () => {
    if (duration === 0) return;
    pausedRef.current = false;
    timerRef.current = setTimeout(dismiss, duration);
  };

  return (
    <div
      role="alert"
      className={cn(
        "min-w-[320px] max-w-[420px] p-3.5 px-4 rounded-rd-sm",
        "bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]",
        "flex items-start gap-3",
        config.border,
        "transition-all duration-normal",
        exiting
          ? "opacity-0 translate-x-full"
          : "opacity-100 translate-x-0 animate-[toast-in_250ms_cubic-bezier(0.4,0,0.2,1)]",
        "max-redesign-sm:min-w-0 max-redesign-sm:w-full"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className={cn("flex-shrink-0 mt-0.5", config.color)}>
        {config.icon}
      </span>

      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-body text-sm font-semibold text-black">
            {toast.title}
          </p>
        )}
        <p className="font-body text-[13px] text-rd-text-body leading-snug">
          {toast.message}
        </p>
      </div>

      <button
        onClick={() => dismiss()}
        className="flex-shrink-0 text-rd-text-muted hover:text-black transition-colors duration-fast cursor-pointer"
        aria-label="Close notification"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Toast container                                                    */
/* ------------------------------------------------------------------ */

export function ToastContainer({
  toasts,
  onClose,
}: {
  toasts: ToastData[];
  onClose: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[1300] flex flex-col gap-2 max-redesign-sm:top-4 max-redesign-sm:right-4 max-redesign-sm:left-4">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  useToast hook                                                      */
/* ------------------------------------------------------------------ */

let toastIdCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback(
    (toast: Omit<ToastData, "id">) => {
      const id = `toast-${++toastIdCounter}`;
      setToasts((prev) => [...prev, { ...toast, id }]);
      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (message: string, title?: string) =>
      addToast({ variant: "success", message, title }),
    [addToast]
  );

  const error = useCallback(
    (message: string, title?: string) =>
      addToast({ variant: "error", message, title }),
    [addToast]
  );

  const info = useCallback(
    (message: string, title?: string) =>
      addToast({ variant: "info", message, title }),
    [addToast]
  );

  const warning = useCallback(
    (message: string, title?: string) =>
      addToast({ variant: "warning", message, title }),
    [addToast]
  );

  return { toasts, addToast, removeToast, success, error, info, warning };
}

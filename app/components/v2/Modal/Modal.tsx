import React, { useCallback, useEffect, useRef } from "react";
import { cn } from "~/lib/utils";

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal                                                              */
/* ------------------------------------------------------------------ */

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Max width of dialog. Default "480px" */
  maxWidth?: string;
  /** Hide the close button (e.g. for auto-dismiss modals) */
  hideCloseButton?: boolean;
  /** Additional className on the dialog container */
  className?: string;
}

export function Modal({
  open,
  onClose,
  children,
  maxWidth = "480px",
  hideCloseButton = false,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    // Prevent body scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, handleKeyDown]);

  // Focus trap — focus dialog on open
  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[1100] bg-black/40 backdrop-blur-[2px] animate-[fade-in_200ms_ease]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={cn(
          "fixed top-1/2 left-1/2 z-[1101]",
          "bg-white rounded-rd-lg p-8",
          "w-[calc(100%-32px)] max-h-[90vh] overflow-y-auto",
          "shadow-[0_24px_48px_rgba(0,0,0,0.12)]",
          "animate-[modal-in_250ms_cubic-bezier(0.4,0,0.2,1)]",
          "outline-none",
          "max-redesign-sm:p-6",
          className
        )}
        style={{
          maxWidth,
          transform: "translate(-50%, -50%)",
        }}
      >
        {!hideCloseButton && (
          <button
            onClick={onClose}
            className={cn(
              "absolute top-4 right-4",
              "w-8 h-8 flex items-center justify-center rounded-full",
              "text-rd-text-secondary hover:bg-[#F5F5F5]",
              "transition-colors duration-fast cursor-pointer"
            )}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        )}

        {children}
      </div>
    </>
  );
}

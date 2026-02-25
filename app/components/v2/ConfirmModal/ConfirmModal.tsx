import { Modal } from "~/components/v2/Modal";
import { Button } from "~/components/v2/Button/Button";
import { cn } from "~/lib/utils";

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function WarningIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 4L44.78 42H3.22L24 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M24 18V28M24 33V34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DestructiveIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" />
      <path d="M24 14V28M24 33V34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  ConfirmModal                                                       */
/* ------------------------------------------------------------------ */

export interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "warning" shows yellow triangle, "destructive" shows red circle */
  variant?: "default" | "warning" | "destructive";
  isLoading?: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} maxWidth="400px" className="!p-10 text-center">
      {variant === "warning" && (
        <div className="text-[#E8A040] mx-auto mb-4">
          <WarningIcon />
        </div>
      )}
      {variant === "destructive" && (
        <div className="text-[#C75050] mx-auto mb-4">
          <DestructiveIcon />
        </div>
      )}

      <p className="font-body text-lg font-semibold text-black mb-2">
        {title}
      </p>

      {description && (
        <p className="font-body text-sm text-rd-text-body leading-relaxed mb-6">
          {description}
        </p>
      )}

      <div className="flex gap-3 justify-center mt-6">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button
          variant="primary"
          onClick={onConfirm}
          isLoading={isLoading}
          className={cn(
            variant === "destructive" &&
              "!bg-[#C75050] hover:!bg-[#A33E3E] active:!bg-[#8A3535]"
          )}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

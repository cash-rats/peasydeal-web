import { useEffect, type PropsWithChildren } from 'react';

interface SimpleModalProps extends PropsWithChildren {
  open: boolean;
  onClose?: () => void;
  title?: string;
}

/**
 * Simple headless modal built with plain React.
 * Keeps dependencies out of the picture so we can validate layout issues.
 */
export default function SimpleModal({
  open,
  onClose,
  title,
  children,
}: SimpleModalProps) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    if (open) {
      document.addEventListener('keydown', handler);
    }

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 text-slate-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {title ? (
          <div className="mb-4 text-lg font-semibold text-slate-900">
            {title}
          </div>
        ) : null}

        {children}

        {onClose ? (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

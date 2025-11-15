import SyncLoader from 'react-spinners/SyncLoader';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

interface PeasyDealLoadingBackdropProps {
  open?: boolean;
}

/**
 * Lightweight overlay that mimics the previous MUI Backdrop without the dependency.
 */
export default function PeasyDealLoadingBackdrop({ open = false }: PeasyDealLoadingBackdropProps) {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    // Render fade-out animation before removing from DOM.
    if (open) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  if (!visible) return null;

  return (
    <div
      className={clsx(
        'fixed inset-0 z-[1200] flex items-center justify-center bg-black/50 transition-opacity duration-200',
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}
      aria-live="polite"
      aria-busy={open}
    >
      <SyncLoader color="#ffffff" />
    </div>
  );
}

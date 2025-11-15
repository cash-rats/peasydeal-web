import { useEffect, useState, type PropsWithChildren } from 'react';

export interface SimpleModalProps extends PropsWithChildren {
  open: boolean;
  onClose?: () => void;
  title?: string;
  overlayOpacity?: number; // 0-100, defaults to 50
  showOverlay?: boolean; // defaults to true
  staggerDelay?: number; // milliseconds, defaults to 150
  showCloseButton?: boolean; // defaults to true
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
  overlayOpacity = 50,
  showOverlay = true,
  staggerDelay = 150,
  showCloseButton = true,
}: SimpleModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);

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

  // Handle animation states
  useEffect(() => {
    if (open) {
      setIsAnimating(true);
      // Delay content appearance for stagger effect
      const timer = setTimeout(() => {
        setShowContent(true);
      }, staggerDelay);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      setShowContent(false);
    }
  }, [open, staggerDelay]);

  if (!open) return null;

  // Calculate overlay background color based on opacity
  const overlayBg = showOverlay
    ? `rgba(0, 0, 0, ${overlayOpacity / 100})`
    : 'transparent';

  const contentTransform = showContent
    ? 'translate(-50%, -50%) scale(1)'
    : 'translate(-50%, -50%) scale(0.95)';

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 flex items-center justify-center p-4 transition-opacity duration-300 w-screen h-screen"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 999,
        backgroundColor: overlayBg,
        opacity: isAnimating ? 1 : 0,
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 text-slate-900 shadow-2xl transition-all duration-300"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          opacity: showContent ? 1 : 0,
          transform: contentTransform,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        {title ? (
          <div className="mb-4 text-lg font-semibold text-slate-900">
            {title}
          </div>
        ) : null}

        {children}

        {onClose && showCloseButton ? (
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

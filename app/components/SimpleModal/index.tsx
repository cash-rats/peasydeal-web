import {
  useEffect,
  useState,
  type PropsWithChildren,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';

export interface SimpleModalProps extends PropsWithChildren {
  open: boolean;
  onClose?: () => void;
  title?: string;
  overlayOpacity?: number; // 0-100, defaults to 50
  showOverlay?: boolean; // defaults to true
  staggerDelay?: number; // milliseconds, defaults to 150
  showCloseButton?: boolean; // defaults to true
  closeOnOverlayClick?: boolean; // defaults to true
  contentClassName?: string;
  header?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseIcon?: boolean; // defaults to true
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
  closeOnOverlayClick = true,
  contentClassName,
  header,
  footer,
  size = 'md',
  showCloseIcon = true,
}: SimpleModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<Element | null>(null);

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
      previouslyFocusedElement.current = document.activeElement;
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      setIsAnimating(true);
      // Delay content appearance for stagger effect
      const timer = setTimeout(() => {
        setShowContent(true);
      }, staggerDelay);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = previousOverflow;
      };
    } else {
      setIsAnimating(false);
      setShowContent(false);
      document.body.style.overflow = '';
    }
  }, [open, staggerDelay]);

  useEffect(() => {
    if (!open || !showContent) return;
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([type="hidden"]):not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');
    const focusable = contentRef.current?.querySelectorAll<HTMLElement>(focusableSelectors);
    const firstFocusable = focusable && focusable.length > 0 ? focusable[0] : contentRef.current;
    firstFocusable?.focus();

    return () => {
      if (previouslyFocusedElement.current instanceof HTMLElement) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [open, showContent]);

  if (!open) return null;

  // Calculate overlay background color based on opacity
  const overlayBg = showOverlay
    ? `rgba(0, 0, 0, ${overlayOpacity / 100})`
    : 'transparent';

  const contentTransform = showContent
    ? 'translate(-50%, -50%) scale(1)'
    : 'translate(-50%, -50%) scale(0.95)';

  const sizeClassMap: Record<NonNullable<SimpleModalProps['size']>, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[calc(100%-2rem)]',
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([type="hidden"]):not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');
    const focusable = contentRef.current?.querySelectorAll<HTMLElement>(focusableSelectors);
    if (!focusable || focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      }
    } else if (document.activeElement === lastElement) {
      firstElement.focus();
      event.preventDefault();
    }
  };

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 flex items-center justify-center p-4 transition-opacity duration-300 w-screen h-screen"
      style={{
        // overflowY: 'scroll',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 999,
        backgroundColor: overlayBg,
        opacity: isAnimating ? 1 : 0,
      }}
      onClick={() => {
        if (closeOnOverlayClick) {
          onClose?.();
        }
      }}
    >
      <div
        ref={contentRef}
        className={[
          `w-full rounded-2xl bg-white p-6
          text-slate-900 shadow-2xl transition-all
          duration-300 focus:outline-none focus-visible:ring-2
          focus-visible:ring-primary relative`,
          sizeClassMap[size],
          contentClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          position: 'fixed',
          opacity: showContent ? 1 : 0,
        }}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onClick={(event) => event.stopPropagation()}
      >
        {header || title ? (
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="text-lg font-semibold text-slate-900">
              {header ?? title}
            </div>
            {showCloseIcon && onClose ? (
              <button
                type="button"
                aria-label="Close"
                className="text-slate-500 hover:text-slate-700 focus:outline-none"
                onClick={onClose}
              >
                ×
              </button>
            ) : null}
          </div>
        ) : null}

        {children}

        {footer}

        {onClose && showCloseButton && !footer ? (
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

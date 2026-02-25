import { useState, useCallback, useEffect } from "react";
import { Modal } from "~/components/v2/Modal";
import { CheckoutInput } from "~/components/v2/CheckoutInput/CheckoutInput";
import { Button } from "~/components/v2/Button/Button";

/* ------------------------------------------------------------------ */
/*  Animated Checkmark (reused from ItemAddedModal pattern)            */
/* ------------------------------------------------------------------ */

function AnimatedCheckmark() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 64 64"
      fill="none"
      className="mx-auto mb-4"
      aria-hidden="true"
    >
      <circle
        cx="32"
        cy="32"
        r="30"
        stroke="#4A7C59"
        strokeWidth="2"
        fill="none"
        style={{
          strokeDasharray: 188,
          strokeDashoffset: 188,
          animation: "checkmark-circle 400ms ease forwards",
        }}
      />
      <path
        d="M20 33L28 41L44 25"
        stroke="#4A7C59"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          strokeDasharray: 36,
          strokeDashoffset: 36,
          animation: "checkmark-check 300ms ease forwards 250ms",
        }}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  LocalStorage helpers                                               */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "pd-email-modal-dismissed";
const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

function isDismissed(): boolean {
  try {
    const ts = localStorage.getItem(STORAGE_KEY);
    if (!ts) return false;
    return Date.now() - parseInt(ts, 10) < COOLDOWN_MS;
  } catch {
    return false;
  }
}

function markDismissed() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // Silently fail if localStorage unavailable
  }
}

/* ------------------------------------------------------------------ */
/*  EmailSubscribeModal                                                */
/* ------------------------------------------------------------------ */

export interface EmailSubscribeModalProps {
  /** Control visibility externally. If not provided, auto-opens after delay. */
  open?: boolean;
  onClose?: () => void;
  /** Called with the email on successful submission */
  onSubscribe?: (email: string) => Promise<void>;
  /** Image URL for the left panel */
  imageUrl?: string;
  /** Disable auto-open (e.g. for bots) */
  disableAutoOpen?: boolean;
}

export function EmailSubscribeModal({
  open: controlledOpen,
  onClose: controlledOnClose,
  onSubscribe,
  imageUrl,
  disableAutoOpen = false,
}: EmailSubscribeModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  // Auto-open after 2s delay if uncontrolled
  useEffect(() => {
    if (isControlled || disableAutoOpen) return;
    if (isDismissed()) return;
    const timer = setTimeout(() => setInternalOpen(true), 2000);
    return () => clearTimeout(timer);
  }, [isControlled, disableAutoOpen]);

  const handleClose = useCallback(() => {
    markDismissed();
    if (isControlled) {
      controlledOnClose?.();
    } else {
      setInternalOpen(false);
    }
    // Reset state after close animation
    setTimeout(() => {
      setEmail("");
      setError("");
      setSuccess(false);
    }, 300);
  }, [isControlled, controlledOnClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await onSubscribe?.(email);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      maxWidth={imageUrl ? "720px" : "400px"}
      className="!p-0 !overflow-hidden"
    >
      <div className={imageUrl ? "grid grid-cols-1 redesign-md:grid-cols-[280px_1fr]" : ""}>
        {/* Image panel — hidden on mobile */}
        {imageUrl && (
          <div className="hidden redesign-md:block bg-rd-bg-warm">
            <img
              src={imageUrl}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Content panel */}
        <div className="p-8 redesign-md:p-8 relative flex flex-col justify-center">
          {success ? (
            /* Success state */
            <div className="text-center py-6">
              <AnimatedCheckmark />
              <p className="font-heading text-xl font-bold text-black mb-2">
                You're in!
              </p>
              <p className="font-body text-sm text-rd-text-body leading-relaxed">
                Check your email for your £3 voucher code.
              </p>
            </div>
          ) : (
            /* Form state */
            <>
              <h2 className="font-heading text-[28px] font-bold text-black leading-tight mb-2">
                Get £3 Off
              </h2>
              <p className="font-body text-sm text-rd-text-body leading-relaxed mb-6">
                Subscribe for exclusive deals and your welcome discount.
              </p>

              <form onSubmit={handleSubmit}>
                <CheckoutInput
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(v) => {
                    setEmail(v);
                    if (error) setError("");
                  }}
                  error={error}
                  className="mb-3"
                />

                <Button
                  variant="primary"
                  type="submit"
                  isLoading={isLoading}
                  className="w-full"
                >
                  Subscribe
                </Button>
              </form>

              <p className="font-body text-[11px] text-rd-text-muted leading-snug mt-3">
                Minimum order £30. Terms apply.
              </p>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

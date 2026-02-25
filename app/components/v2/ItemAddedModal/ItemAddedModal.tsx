import { useEffect, useRef } from "react";
import { Modal } from "~/components/v2/Modal";
import { Button } from "~/components/v2/Button/Button";

/* ------------------------------------------------------------------ */
/*  Animated Checkmark                                                 */
/* ------------------------------------------------------------------ */

function AnimatedCheckmark() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      className="mx-auto mb-5"
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
/*  ItemAddedModal                                                     */
/* ------------------------------------------------------------------ */

export interface ItemAddedModalProps {
  open: boolean;
  onClose: () => void;
  onContinueShopping?: () => void;
  onViewCart?: () => void;
}

export function ItemAddedModal({
  open,
  onClose,
  onContinueShopping,
  onViewCart,
}: ItemAddedModalProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactedRef = useRef(false);

  // Auto-dismiss after 2s unless user interacts
  useEffect(() => {
    if (!open) {
      interactedRef.current = false;
      return;
    }
    timerRef.current = setTimeout(() => {
      if (!interactedRef.current) onClose();
    }, 2000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [open, onClose]);

  const handleContinue = () => {
    interactedRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    onContinueShopping?.();
    onClose();
  };

  const handleViewCart = () => {
    interactedRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    onViewCart?.();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="400px"
      hideCloseButton
      className="!p-10 text-center"
    >
      <AnimatedCheckmark />

      <p className="font-body text-base font-semibold text-black mb-2">
        Added to cart
      </p>
      <p className="font-body text-sm text-rd-text-secondary">
        Continue shopping or view your cart
      </p>

      <div className="flex gap-3 justify-center mt-6">
        <Button variant="secondary" size="sm" onClick={handleContinue}>
          Continue Shopping
        </Button>
        <Button variant="primary" size="sm" onClick={handleViewCart}>
          View Cart
        </Button>
      </div>
    </Modal>
  );
}

import { useState } from "react";
import { cn } from "~/lib/utils";
import { Modal } from "~/components/v2/Modal";
import { Button } from "~/components/v2/Button/Button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface CancelReason {
  id: number;
  reason: string;
}

const CANCEL_REASONS: CancelReason[] = [
  { id: 1, reason: "I've had wrong contact or shipping information on this order." },
  { id: 2, reason: "I bought the wrong items" },
  { id: 3, reason: "Found cheaper price elsewhere" },
];

/* ------------------------------------------------------------------ */
/*  CancelOrderModal                                                   */
/* ------------------------------------------------------------------ */

export interface CancelOrderModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

export function CancelOrderModal({
  open,
  onClose,
  onConfirm,
  isLoading = false,
}: CancelOrderModalProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [otherReason, setOtherReason] = useState("");
  const [showOther, setShowOther] = useState(false);

  const handleSelect = (reason: CancelReason) => {
    setSelectedId(reason.id);
    setShowOther(false);
  };

  const handleSelectOther = () => {
    setSelectedId(null);
    setShowOther(true);
  };

  const handleConfirm = () => {
    if (showOther && otherReason.trim()) {
      onConfirm(otherReason.trim());
    } else if (selectedId) {
      const reason = CANCEL_REASONS.find((r) => r.id === selectedId);
      if (reason) onConfirm(reason.reason);
    }
  };

  const canConfirm = selectedId != null || (showOther && otherReason.trim().length > 0);

  return (
    <Modal open={open} onClose={onClose} maxWidth="440px">
      <h2 className="font-body text-lg font-semibold text-black mb-6">
        Cancel Order
      </h2>

      <div className="space-y-2 mb-4">
        {CANCEL_REASONS.map((reason) => (
          <button
            key={reason.id}
            onClick={() => handleSelect(reason)}
            className={cn(
              "w-full text-left p-4 border rounded-rd-sm font-body text-sm cursor-pointer",
              "transition-all duration-fast",
              selectedId === reason.id
                ? "border-black bg-[#F9F9F9]"
                : "border-rd-border-light hover:border-[#CCC]"
            )}
          >
            {reason.reason}
          </button>
        ))}

        {/* Other reasons */}
        <button
          onClick={handleSelectOther}
          className={cn(
            "w-full text-left p-4 border rounded-rd-sm font-body text-sm cursor-pointer",
            "transition-all duration-fast",
            showOther
              ? "border-black bg-[#F9F9F9]"
              : "border-rd-border-light hover:border-[#CCC]"
          )}
        >
          Other reasons
        </button>
      </div>

      {showOther && (
        <div className="mb-4">
          <textarea
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value.slice(0, 150))}
            placeholder="Please tell us why..."
            className="w-full h-[100px] p-3.5 border border-[#CCC] rounded-rd-sm font-body text-sm text-black resize-none outline-none focus:border-black focus:shadow-[0_0_0_1px_#000] transition-all duration-fast"
          />
          <p className="font-body text-[11px] text-rd-text-muted text-right mt-1">
            {otherReason.length}/150
          </p>
        </div>
      )}

      <div className="flex gap-3 justify-end mt-6">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Go Back
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          isLoading={isLoading}
          disabled={!canConfirm}
          className="!bg-[#C75050] hover:!bg-[#A33E3E]"
        >
          Confirm Cancellation
        </Button>
      </div>
    </Modal>
  );
}

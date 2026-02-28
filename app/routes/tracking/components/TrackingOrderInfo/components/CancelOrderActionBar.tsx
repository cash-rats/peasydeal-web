import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Modal } from '~/components/v2/Modal';
import { Button } from '~/components/v2/Button/Button';

export interface CancelReason {
  id?: number;
  reason: string;
};

const cancelReasons: CancelReason[] = [
  {
    reason: 'I\'ve had wrong contact or shipping information on this order.',
  },
  {
    reason: 'I bought the wrong items',
  },
  {
    reason: 'Found cheaper price elsewhere',
  },
  {
    reason: 'Other reasons',
  },
].map((cr, idx) => ({
  ...cr,
  id: idx + 1,
}));

interface ICancelOrderActionBar {
  onConfirm?: (reason: CancelReason | null) => void;

  openCancelModal?: boolean;

  onOpen?: () => void;
  onClose?: () => void;
  isLoading?: boolean;
};

export default function CancelOrderActionBar({
  onConfirm = () => { },
  openCancelModal = false,
  onOpen = () => { },
  onClose = () => { },
  isLoading = false,
}: ICancelOrderActionBar) {
  const [selected, setSelected] = useState<CancelReason | null>(null);
  const [otherReason, setOtherReason] = useState('');
  const otherReasonItem = cancelReasons[cancelReasons.length - 1];
  const isOtherReason = selected?.id === otherReasonItem.id;
  const canConfirm = selected !== null && (!isOtherReason || otherReason.trim().length > 0);
  const handleConfirm = () => {
    if (!selected) return;
    const reason = isOtherReason && otherReason.trim()
      ? { ...selected, reason: otherReason.trim() }
      : selected;
    onConfirm(reason);
  };
  const handleClose = () => {
    setSelected(null);
    setOtherReason('');
    onClose();
  };

  useEffect(() => {
    if (!openCancelModal) {
      setSelected(null);
      setOtherReason('');
    }
  }, [openCancelModal]);

  return (
    <div>
      <Modal
        open={openCancelModal}
        onClose={handleClose}
        maxWidth="440px"
      >
        <h2 className="mb-5 font-body text-lg font-semibold text-black">
          Cancel Order
        </h2>

        <ul className="space-y-2">
          {cancelReasons.map((reason) => (
            <li key={`cancel_reason_${reason.id}`}>
              <button
                type="button"
                onClick={() => setSelected(reason)}
                className={clsx(
                  'w-full rounded-rd-sm border px-4 py-3 text-left font-body text-sm transition-all duration-fast',
                  selected?.id === reason.id
                    ? 'border-black bg-[#F9F9F9]'
                    : 'border-rd-border-light hover:border-[#CCCCCC]'
                )}
              >
                {reason.reason}
              </button>
            </li>
          ))}
        </ul>

        {isOtherReason ? (
          <div className="mt-3">
            <textarea
              className="h-[100px] w-full resize-none rounded-rd-sm border border-[#CCCCCC] p-3.5 font-body text-sm text-black outline-none transition-all duration-fast focus:border-black focus:shadow-[0_0_0_1px_#000]"
              placeholder="Please tell us why..."
              rows={4}
              maxLength={150}
              value={otherReason}
              onChange={(evt) => setOtherReason(evt.target.value)}
            />
            <p className="mt-1 text-right font-body text-[11px] text-rd-text-muted">
              {otherReason.length}/150
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleClose}
            disabled={isLoading}
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            disabled={!canConfirm || isLoading}
            isLoading={isLoading}
            className="!bg-[#C75050] hover:!bg-[#A33E3E]"
          >
            Confirm Cancellation
          </Button>
        </div>
      </Modal>

      <div className="mt-2 flex items-center justify-end">
        <Button
          variant="secondary"
          size="sm"
          onClick={onOpen}
        >
          Cancel Order
        </Button>
      </div>
    </div>
  );
};

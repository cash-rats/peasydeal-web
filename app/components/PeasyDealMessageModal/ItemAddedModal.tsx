
import { HiCheckCircle } from 'react-icons/hi2';

import GeneralModal from './index';

interface ItemAddedModalProps {
  open?: boolean;
  onClose?: () => void;
  onViewCart?: () => void;
  color?: string;
}

const ItemAddedModal = ({ open = false, onClose, color }: ItemAddedModalProps) => {
  const iconColor = color ?? '#10B981';

  return (
    <GeneralModal
      open={open}
      onClose={onClose}
      showOverlay={false}
    >
      <div
        className="
          flex
          w-full
          max-w-sm
          flex-col
          items-center
          gap-5
          rounded-2xl
          bg-white/95
          px-6
          py-6
          text-center
          shadow-2xl
          ring-1
          ring-emerald-100
          backdrop-blur
        "
        role="status"
        aria-live="polite"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 shadow-md shadow-emerald-100">
          <HiCheckCircle
            size={64}
            color={iconColor}
            className="text-emerald-500"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">
            Item added to your cart
          </h3>
          <p className="text-sm text-slate-500">
            You can review your cart now or keep browsing deals.
          </p>
        </div>
      </div>
    </GeneralModal>
  );
}

export default ItemAddedModal;

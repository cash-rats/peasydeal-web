
import { HiCheckCircle } from 'react-icons/hi2';

import GeneralModal from './index';

interface ItemAddedModalProps {
  open?: boolean;
  onClose?: () => void;
  onViewCart?: () => void;
}

const ItemAddedModal = ({ open = false, onClose, onViewCart }: ItemAddedModalProps) => {
  return (
    <GeneralModal open={open} onClose={onClose} showOverlay>
      <div
        className="
          flex
          w-full
          max-w-sm
          flex-col
          items-center
          gap-4
          rounded-xl
          bg-white
          px-6
          py-7
          text-center
          shadow-2xl
        "
        role="status"
        aria-live="polite"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
          <HiCheckCircle
            size={64}
            className="text-emerald-500"
          />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-900">
            Item added to your cart
          </h3>
        </div>
      </div>
    </GeneralModal>
  );
}

export default ItemAddedModal;

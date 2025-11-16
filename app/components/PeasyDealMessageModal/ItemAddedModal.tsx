
import { AiFillCheckCircle } from 'react-icons/ai';

import GeneralModal from './index';

interface ItemAddedModalProps {
  open?: boolean;
  onClose?: () => void;
}

const ItemAddedModal = ({ open = false, onClose }: ItemAddedModalProps) => {
  return (
    <GeneralModal open={open} onClose={onClose}>
      <div
        className="
          flex flex-col items-center justify-center gap-4
          w-full max-w-sm
          rounded-lg bg-[#323131] px-6 py-6
          text-black
        "
        role="status"
        aria-live="polite"
      >
        <span className="flex h-16 w-16 items-center justify-center text-white">
          <AiFillCheckCircle size={60} />
        </span>
        <p className="text-center text-lg font-semibold leading-snug">
          Item added to cart
        </p>
      </div>
    </GeneralModal>
  );
}

export default ItemAddedModal;

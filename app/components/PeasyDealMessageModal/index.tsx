import type { ReactNode } from 'react';
import SimpleModal from '~/components/SimpleModal';

interface LoadingModalProps {
  open?: boolean;
  showOverlay?: boolean
  onClose?: () => void;
  children: ReactNode;
}

export default function LoadingModal({ open = true, onClose, children, showOverlay = false }: LoadingModalProps) {
  return (
    <SimpleModal
      open={Boolean(open)}
      onClose={onClose}
      showCloseButton={false}
      overlayOpacity={60}
      showOverlay={showOverlay}
      title={undefined}
    >
      <div className="
        max-w-sm
        w-full
        border-0
        bg-[#323131]
        text-white
        shadow-2xl
        sm:rounded
        p-4
        flex
        items-center
        justify-center
      ">
        {children}
      </div>
    </SimpleModal>
  );
}
